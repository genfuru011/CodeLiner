<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import NeovimStatusBar from './components/NeovimStatusBar.vue'
import NeovimSidebar from './components/NeovimSidebar.vue'
import CommandLine from './components/CommandLine.vue'
import SettingsModal from './components/SettingsModal.vue'
import TabBar from './components/TabBar.vue'
import { useResponsive } from './composables/useResponsive'
import { useStatusBar } from './composables/useStatusBar'
import { useSettings } from './composables/useSettings'
import { useFileSystem } from './composables/useFileSystem'
import { useTabManager } from './composables/useTabManager'

// Responsive design
const { isMobile } = useResponsive()

// Status bar
const { 
  cursorPosition, 
  totalLines, 
  fileLanguage, 
  encoding, 
  updateCursorPosition, 
  updateFileInfo, 
  setExecuting 
} = useStatusBar()

// Settings
const { backgroundOpacity } = useSettings()

// File system
const {
  saveFile,
  loadFile,
  createNewFile,
  createFolder,
  init: initFileSystem
} = useFileSystem()

// Tab management
const {
  activeTabs,
  activeTab,
  activeTabId,
  createTab,
  closeTab,
  setActiveTab,
  updateTabContent,
  markTabSaved,
  updateCursorPosition: updateTabCursorPosition,
  handleKeyboardShortcuts
} = useTabManager()

// Mobile/Tablet layout state
const showSidebar = ref(true)
const showConsole = ref(true)
const activePanel = ref<'editor' | 'console'>('editor')

// Settings modal
const showSettingsModal = ref(false)

// Neovim state
const currentMode = ref<'normal' | 'insert' | 'visual' | 'command'>('normal')
const showCommandLine = ref(false)
const sidebarCollapsed = ref(false)

// Current editor content and output
const code = computed(() => activeTab.value?.content || '')
const output = ref('Welcome to CodeLiner!\nReady to code...')

// Current active file name for display
const activeFileName = computed(() => activeTab.value?.fileName || 'No file')

// Mobile/Tablet functions
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const toggleConsole = () => {
  showConsole.value = !showConsole.value
}

const switchPanel = (panel: 'editor' | 'console') => {
  activePanel.value = panel
}

// Folder toggle handler
const handleFolderToggle = (path: string) => {
  console.log('Toggle folder:', path)
  // TODO: Implement folder expansion logic
}

// File operations
const handleFileSelect = async (path: string) => {
  try {
    const file = await loadFile(path)
    if (file) {
      const tabId = createTab(file)
      setActiveTab(tabId)
    }
  } catch (error) {
    console.error('Failed to open file:', error)
    output.value = `Error: Failed to open file ${path}`
  }
}

const handleNewFile = async () => {
  try {
    const fileName = prompt('Enter file name:', 'untitled.js')
    if (!fileName) return
    
    const path = `/${fileName}`
    const fileId = await createNewFile(fileName, path, '// New file\n')
    const file = await loadFile(fileId)
    
    if (file) {
      const tabId = createTab(file)
      setActiveTab(tabId)
    }
  } catch (error) {
    console.error('Failed to create file:', error)
    output.value = `Error: Failed to create new file`
  }
}

const handleNewFolder = async () => {
  try {
    const folderName = prompt('Enter folder name:', 'new-folder')
    if (!folderName) return
    
    const path = `/${folderName}`
    await createFolder({
      name: folderName,
      path,
      children: [],
      expanded: false
    })
    
    // Refresh file tree
    await refreshFileTree()
  } catch (error) {
    console.error('Failed to create folder:', error)
    output.value = `Error: Failed to create folder`
  }
}

const handleSaveFile = async () => {
  if (!activeTab.value) return
  
  try {
    await saveFile({
      name: activeTab.value.fileName,
      path: activeTab.value.filePath,
      content: activeTab.value.content,
      language: activeTab.value.language
    })
    
    markTabSaved(activeTab.value.id)
    output.value = `Saved: ${activeTab.value.fileName}`
  } catch (error) {
    console.error('Failed to save file:', error)
    output.value = `Error: Failed to save ${activeTab.value.fileName}`
  }
}

const refreshFileTree = async () => {
  console.log('Refreshing file tree...')
  // TODO: Implement file tree refresh from file system
}

// Code execution function
const runCode = () => {
  if (!code.value) return
  
  setExecuting(true)
  
  try {
    // Create a simple console mock
    const consoleLogs: string[] = []
    const mockConsole = {
      log: (...args: any[]) => {
        consoleLogs.push(args.join(' '))
      }
    }
    
    // Replace console with our mock
    const codeToRun = code.value.replace(/console\.log/g, 'mockConsole.log')
    
    // Execute the code in a safe context
    const func = new Function('mockConsole', codeToRun)
    func(mockConsole)
    
    output.value = consoleLogs.join('\n') || 'Code executed successfully!'
  } catch (error) {
    output.value = `Error: ${error}`
  } finally {
    setExecuting(false)
    updateFileStats()
  }
}

// Status bar event handlers
const handleCursorChange = (line: number, column: number) => {
  updateCursorPosition(line, column)
  if (activeTabId.value) {
    updateTabCursorPosition(activeTabId.value, line, column)
  }
}

// Content change handler
const handleContentChange = (newContent: string) => {
  if (activeTabId.value) {
    updateTabContent(activeTabId.value, newContent)
  }
}

// Watch for code changes to update file info
const updateFileStats = () => {
  if (activeTab.value) {
    updateFileInfo(code.value, activeTab.value.language)
  }
}

// Watch active tab changes
watch(activeTab, () => {
  updateFileStats()
})

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Handle tab shortcuts first
  handleKeyboardShortcuts(event)
  
  // Cmd/Ctrl + S for Save
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault()
    handleSaveFile()
    return
  }
  
  // Cmd/Ctrl + N for New File
  if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
    event.preventDefault()
    handleNewFile()
    return
  }
  
  // Cmd/Ctrl + , for Settings
  if ((event.metaKey || event.ctrlKey) && event.key === ',') {
    event.preventDefault()
    showSettingsModal.value = true
    return
  }
  
  // ':' to open command line (when not in input)
  if (event.key === ':' && event.target === document.body) {
    event.preventDefault()
    showCommandLine.value = true
    currentMode.value = 'command'
    return
  }
  
  // 'Escape' to return to normal mode
  if (event.key === 'Escape') {
    event.preventDefault()
    currentMode.value = 'normal'
    showCommandLine.value = false
    return
  }
  
  // 'i' to enter insert mode (when in normal mode)
  if (event.key === 'i' && currentMode.value === 'normal' && event.target === document.body) {
    event.preventDefault()
    currentMode.value = 'insert'
    return
  }
}

// Mount keyboard event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  // Initialize background opacity immediately for default transparency
  updateBackgroundOpacity()
  // Ensure CSS variables are set for initial transparency
  document.documentElement.style.setProperty('--bg-opacity', '0.75')
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Update CSS custom property for background opacity
const updateBackgroundOpacity = () => {
  document.documentElement.style.setProperty('--bg-opacity', backgroundOpacity.value.toString())
}

// Watch for background opacity changes
watch(backgroundOpacity, updateBackgroundOpacity)

// Initialize file system on mount
onMounted(async () => {
  document.addEventListener('keydown', handleKeyDown)
  updateBackgroundOpacity()
  document.documentElement.style.setProperty('--bg-opacity', '0.75')
  
  // Initialize file system
  try {
    await initFileSystem()
    console.log('File system initialized')
  } catch (error) {
    console.error('Failed to initialize file system:', error)
  }
})

// Neovim functions
const toggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleCommandExecute = (command: string) => {
  console.log('Execute command:', command)
  
  switch (command) {
    case 'save':
    case 'w':
      handleSaveFile()
      break
    case 'quit':
    case 'q':
      console.log('Quit')
      break
    case 'save-quit':
    case 'wq':
      handleSaveFile()
      console.log('Save and quit')
      break
    case 'open-command-line':
      showCommandLine.value = true
      currentMode.value = 'command'
      break
    default:
      console.log('Unknown command:', command)
  }
  
  if (command !== 'open-command-line') {
    showCommandLine.value = false
    currentMode.value = 'normal'
  }
}

const closeCommandLine = () => {
  showCommandLine.value = false
  currentMode.value = 'normal'
}
</script>

<template>
  <div class="neovim-layout">
    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Neovim Sidebar -->
      <NeovimSidebar
        v-if="!isMobile || showSidebar"
        :is-collapsed="sidebarCollapsed"
        :file-tree="[]"
        :selected-file="activeTab?.filePath || ''"
        current-directory="/Users/hiroto/Documents/CodeLiner"
        @toggle="toggleSidebarCollapse"
        @file-select="handleFileSelect"
        @folder-toggle="handleFolderToggle"
        @new-file="handleNewFile"
        @new-folder="handleNewFolder"
        @refresh="refreshFileTree"
      />

      <!-- Main Editor Area -->
      <div class="main-area">
        <!-- Mobile Header (only on mobile) -->
        <div v-if="isMobile" class="mobile-header">
          <button @click="toggleSidebar" class="mobile-menu-btn">
            {{ showSidebar ? 'x' : '☰' }}
          </button>
          <span class="mobile-title">{{ activeFileName }}</span>
          <div class="mobile-panel-switcher">
            <button 
              @click="switchPanel('editor')"
              :class="['panel-btn', { active: activePanel === 'editor' }]"
            >
              Editor
            </button>
            <button 
              @click="switchPanel('console')"
              :class="['panel-btn', { active: activePanel === 'console' }]"
            >
              Console
            </button>
          </div>
        </div>

        <!-- Tab Bar -->
        <TabBar
          :tabs="activeTabs"
          :active-tab-id="activeTabId"
          @tab-select="setActiveTab"
          @tab-close="closeTab"
          @new-file="handleNewFile"
        />

        <!-- Editor -->
        <div class="editor-container">
          <MonacoEditor
            v-if="!isMobile || activePanel === 'editor'"
            v-model="code"
            :language="fileLanguage"
            @cursor-change="handleCursorChange"
            @update:modelValue="handleContentChange"
            class="flex-1"
          />
        </div>

        <!-- Console (when visible) -->
        <div 
          v-if="showConsole && (!isMobile || activePanel === 'console')"
          class="console-area"
        >
          <div class="console-header">
            <span class="console-title">Output</span>
            <div class="console-actions">
              <button @click="runCode" class="run-btn">▶ Run</button>
              <button 
                @click="toggleConsole"
                class="console-close"
              >
                x
              </button>
            </div>
          </div>
          <div class="console-content">
            <pre class="console-output">{{ output }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Neovim Status Bar -->
    <NeovimStatusBar
      :current-mode="currentMode"
      :file-name="activeFileName"
      :is-modified="activeTab?.isModified || false"
      :git-branch="'main'"
      :git-changes="'+2 ~1'"
      :encoding="encoding"
      :file-type="fileLanguage"
      :line="parseInt(cursorPosition)"
      :column="1"
      :total-lines="totalLines"
      @openSettings="showSettingsModal = true"
    />

    <!-- Command Line -->
    <CommandLine
      :is-visible="showCommandLine"
      @close="closeCommandLine"
      @execute="handleCommandExecute"
    />

    <!-- Settings Modal -->
    <SettingsModal
      :isOpen="showSettingsModal"
      @close="showSettingsModal = false"
    />

    <!-- Mobile overlay for sidebar -->
    <div
      v-if="isMobile && showSidebar"
      class="mobile-overlay"
      @click="toggleSidebar"
    />
  </div>
</template>

<style scoped>
.neovim-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--nvim-bg);
  color: var(--nvim-fg);
  font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
}

.content-area {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--nvim-bg-alt);
  border-bottom: 1px solid var(--nvim-border);
  height: 44px;
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: var(--nvim-fg);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background: var(--nvim-selection);
}

.mobile-title {
  font-weight: 600;
  color: var(--nvim-blue);
  font-size: 16px;
}

.mobile-panel-switcher {
  display: flex;
  gap: 4px;
}

.panel-btn {
  background: none;
  border: 1px solid var(--nvim-border);
  color: var(--nvim-fg-dim);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-btn.active {
  background: var(--nvim-blue);
  color: var(--nvim-bg);
  border-color: var(--nvim-blue);
}

.panel-btn:not(.active):hover {
  background: var(--nvim-selection);
  color: var(--nvim-fg);
}

.editor-container {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.2s;
  font-size: 16px;
  line-height: 1;
}

.tab-close:hover {
  background: var(--nvim-red);
  color: var(--nvim-bg);
}

.editor-container {
  flex: 1;
  display: flex;
  background: var(--nvim-bg);
}

.console-area {
  height: 200px;
  background: var(--nvim-bg-dark);
  border-top: 1px solid var(--nvim-border);
  display: flex;
  flex-direction: column;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--nvim-bg-alt);
  border-bottom: 1px solid var(--nvim-border);
}

.console-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.run-btn {
  background: var(--nvim-green);
  color: var(--nvim-bg);
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.run-btn:hover {
  background: var(--nvim-blue);
  transform: translateY(-1px);
}

.console-title {
  color: var(--nvim-blue);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.console-close {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.2s;
}

.console-close:hover {
  background: var(--nvim-selection);
  color: var(--nvim-fg);
}

.console-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.console-output {
  color: var(--nvim-green);
  font-size: 13px;
  line-height: 1.4;
  white-space: pre-wrap;
  margin: 0;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-area {
    flex-direction: column;
  }
  
  .main-area {
    order: 1;
  }
  
  .mobile-header {
    order: 0;
  }
  
  .tab-bar {
    display: none; /* Hide tab bar on mobile */
  }
  
  .console-area {
    height: 50vh; /* Full height on mobile when active */
  }
}

@media (min-width: 769px) {
  .content-area {
    flex-direction: row;
  }
  
  .mobile-header {
    display: none;
  }
  
  .main-area {
    flex-direction: column;
  }
}
</style>
