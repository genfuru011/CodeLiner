<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import StatusBar from './components/StatusBar.vue'
import SettingsModal from './components/SettingsModal.vue'
import FileIcon from './components/FileIcon.vue'
import { useResizablePanels } from './composables/useResizablePanels'
import { useResponsive } from './composables/useResponsive'
import { useStatusBar } from './composables/useStatusBar'
import { useSettings } from './composables/useSettings'

// Responsive design
const { isMobile, isTablet, isDesktop, windowWidth, windowHeight } = useResponsive()

// Settings
const { showStatusBar } = useSettings()

// Status bar
const { 
  cursorPosition, 
  fileSizeFormatted, 
  totalLines, 
  fileLanguage, 
  encoding, 
  isExecuting, 
  lastExecutionFormatted,
  updateCursorPosition, 
  updateFileInfo, 
  setExecuting 
} = useStatusBar()

// Resizable panels
const { sidebarWidth, consoleWidth, isDragging, dragTarget, startDrag } = useResizablePanels()

// Mobile/Tablet layout state (override settings for mobile/tablet)
const showSidebar = ref(true)
const showConsole = ref(true)
const activePanel = ref<'editor' | 'console'>('editor')

// Settings modal
const showSettingsModal = ref(false)

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Cmd/Ctrl + , for Settings
  if ((event.metaKey || event.ctrlKey) && event.key === ',') {
    event.preventDefault()
    showSettingsModal.value = true
  }
}

// State management
const activeFile = ref('main.js')
const code = ref(`// Welcome to CodeLiner
console.log('Hello, World!');

// HackMD inspired code editor
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet('CodeLiner');
console.log(message);`)

const output = ref('Hello, World!\nHello, CodeLiner!')

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

// Status bar event handlers
const handleCursorChange = (line: number, column: number) => {
  updateCursorPosition(line, column)
}

// Watch for code changes to update file info
const updateFileStats = () => {
  updateFileInfo(code.value, 'javascript')
}

// Initialize file stats
updateFileStats()

// Watch code changes to update file statistics
watch(code, () => {
  updateFileStats()
}, { deep: true })

// Mount keyboard event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Functions
const saveFile = () => {
  // TODO: Implement file saving functionality
  console.log('File saved:', activeFile.value)
}

const runCode = () => {
  // Simple JavaScript execution (for demo purposes)
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
</script>

<template>
  <div class="min-h-screen bg-dark-bg text-dark-text font-mono">
    <!-- Header -->
    <header class="bg-dark-surface border-b border-dark-border px-4 md:px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- Mobile Menu Button -->
          <button 
            v-if="isMobile || isTablet"
            @click="toggleSidebar"
            class="p-1 text-dark-text-muted hover:text-dark-text transition-colors md:hidden"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <h1 class="text-lg md:text-xl font-bold text-accent">CodeLiner</h1>
          
          <!-- Desktop Navigation -->
          <nav v-if="isDesktop" class="flex space-x-4 text-sm">
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">File</button>
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">Edit</button>
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">View</button>
          </nav>
        </div>
        
        <div class="flex items-center space-x-2 md:space-x-3">
          <!-- Mobile Panel Switcher -->
          <div v-if="isMobile" class="flex bg-dark-surface-hover rounded-md p-1">
            <button 
              @click="switchPanel('editor')"
              :class="[
                'px-2 py-1 text-xs rounded transition-colors',
                activePanel === 'editor' ? 'bg-accent text-white' : 'text-dark-text-muted'
              ]"
            >
              Editor
            </button>
            <button 
              @click="switchPanel('console')"
              :class="[
                'px-2 py-1 text-xs rounded transition-colors',
                activePanel === 'console' ? 'bg-accent text-white' : 'text-dark-text-muted'
              ]"
            >
              Console
            </button>
          </div>
          
          <button @click="runCode" class="px-2 md:px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded text-xs md:text-sm transition-colors">
            Run
          </button>
          
          <!-- Console Toggle for Tablet -->
          <button 
            v-if="isTablet"
            @click="toggleConsole"
            class="px-2 md:px-3 py-1 bg-dark-surface-hover hover:bg-dark-border text-dark-text rounded text-xs md:text-sm transition-colors"
          >
            {{ showConsole ? 'Hide' : 'Show' }} Console
          </button>
          
          <!-- Share Button (Desktop) -->
          <button 
            v-if="isDesktop"
            class="px-3 py-1 bg-dark-surface-hover hover:bg-dark-border text-dark-text rounded text-sm transition-colors"
          >
            Share
          </button>
          
          <!-- Settings Button -->
          <button 
            @click="showSettingsModal = true"
            class="p-1 md:p-2 text-dark-text-muted hover:text-dark-text transition-colors"
            title="Settings"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-60px-24px)]">
      <!-- Sidebar (Desktop/Tablet with toggle) -->
      <aside 
        v-if="(isDesktop) || (isTablet && showSidebar) || (isMobile && showSidebar)"
        :style="isDesktop ? { width: `${sidebarWidth}px` } : {}"
        :class="[
          'bg-dark-surface border-r border-dark-border transition-all duration-200',
          isMobile ? 'absolute left-0 top-0 bottom-0 z-20 w-64' : '',
          isTablet ? 'w-64' : ''
        ]"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-dark-text-muted">Explorer</h2>
            <!-- Close button for mobile -->
            <button 
              v-if="isMobile"
              @click="toggleSidebar"
              class="text-dark-text-muted hover:text-dark-text transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-1">
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon :file-name="activeFile" :size="14" />
              <span class="text-sm">{{ activeFile }}</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="index.html" :size="14" />
              <span class="text-sm text-dark-text-muted">index.html</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="style.css" :size="14" />
              <span class="text-sm text-dark-text-muted">style.css</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="script.ts" :size="14" />
              <span class="text-sm text-dark-text-muted">script.ts</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="component.vue" :size="14" />
              <span class="text-sm text-dark-text-muted">component.vue</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="package.json" :size="14" />
              <span class="text-sm text-dark-text-muted">package.json</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="README.md" :size="14" />
              <span class="text-sm text-dark-text-muted">README.md</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="data.json" :size="14" />
              <span class="text-sm text-dark-text-muted">data.json</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="app.py" :size="14" />
              <span class="text-sm text-dark-text-muted">app.py</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <FileIcon file-name="docs" :is-directory="true" :size="14" />
              <span class="text-sm text-dark-text-muted">docs/</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Sidebar Resizer (Desktop only) -->
      <div 
        v-if="isDesktop"
        @mousedown="startDrag('sidebar', $event)"
        @touchstart="startDrag('sidebar', $event)"
        class="w-1 bg-dark-border hover:bg-accent cursor-col-resize transition-colors duration-200 group touch-pan-y"
        :class="{ 'bg-accent': isDragging && dragTarget === 'sidebar' }"
      >
        <div class="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-0.5 h-8 bg-current rounded-full"></div>
        </div>
      </div>

      <!-- Editor Area -->
      <main 
        :class="[
          'flex flex-col min-w-0 transition-all duration-200',
          isMobile ? 'flex-1' : 'flex-1'
        ]"
      >
        <!-- Tab Bar -->
        <div class="bg-dark-surface border-b border-dark-border px-4">
          <div class="flex">
            <div class="px-3 md:px-4 py-2 bg-dark-bg text-dark-text text-xs md:text-sm border-r border-dark-border flex items-center space-x-2">
              <FileIcon :file-name="activeFile" :size="12" :aria-label="`File icon for ${activeFile}`" />
              <span>{{ activeFile }}</span>
              <button class="ml-2 text-dark-text-muted hover:text-dark-text transition-colors">×</button>
            </div>
          </div>
        </div>

        <!-- Code Editor Area -->
        <div 
          v-show="!isMobile || activePanel === 'editor'"
          class="flex-1 relative bg-dark-bg"
        >
          <MonacoEditor 
            v-model="code" 
            language="javascript" 
            class="absolute inset-0"
            @save="saveFile"
            @run="runCode"
            @cursor-change="handleCursorChange"
          />
        </div>
        
        <!-- Mobile Console -->
        <div 
          v-if="isMobile && activePanel === 'console'"
          class="flex-1 bg-dark-surface"
        >
          <div class="border-b border-dark-border px-4 py-2">
            <h2 class="text-sm font-semibold text-dark-text-muted">Console</h2>
          </div>
          <div class="p-4 h-[calc(100%-40px)]">
            <div class="bg-dark-bg p-3 rounded border border-dark-border font-mono text-xs h-full overflow-auto">
              <pre class="text-green-400 whitespace-pre-wrap">{{ output }}</pre>
            </div>
          </div>
        </div>
      </main>

      <!-- Console Resizer (Desktop only) -->
      <div 
        v-if="isDesktop && showConsole"
        @mousedown="startDrag('console', $event)"
        @touchstart="startDrag('console', $event)"
        class="w-1 bg-dark-border hover:bg-accent cursor-col-resize transition-colors duration-200 group touch-pan-y"
        :class="{ 'bg-accent': isDragging && dragTarget === 'console' }"
      >
        <div class="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-0.5 h-8 bg-current rounded-full"></div>
        </div>
      </div>

      <!-- Output Panel (Desktop/Tablet) -->
      <aside 
        v-if="!isMobile && showConsole"
        :style="isDesktop ? { width: `${consoleWidth}px` } : {}"
        :class="[
          'bg-dark-surface border-l border-dark-border flex flex-col transition-all duration-200',
          isTablet ? 'w-80' : ''
        ]"
      >
        <div class="border-b border-dark-border px-4 py-2">
          <h2 class="text-sm font-semibold text-dark-text-muted">Console</h2>
        </div>
        <div class="flex-1 p-4">
          <div class="bg-dark-bg p-3 rounded border border-dark-border font-mono text-sm h-full overflow-auto">
            <pre class="text-green-400 whitespace-pre-wrap">{{ output }}</pre>
          </div>
        </div>
      </aside>
      
      <!-- Mobile Overlay for Sidebar -->
      <div 
        v-if="isMobile && showSidebar"
        @click="toggleSidebar"
        class="absolute inset-0 bg-black bg-opacity-50 z-10"
      ></div>
    </div>
    
    <!-- Status Bar -->
    <StatusBar 
      v-if="showStatusBar"
      :active-file="activeFile"
      :file-language="fileLanguage"
      :file-size-formatted="fileSizeFormatted"
      :total-lines="totalLines"
      :is-executing="isExecuting"
      :last-execution-formatted="lastExecutionFormatted"
      :cursor-position="cursorPosition"
      :encoding="encoding"
      :window-width="windowWidth"
      :window-height="windowHeight"
      :is-mobile="isMobile"
      :is-tablet="isTablet"
      :is-desktop="isDesktop"
    />
    
    <!-- Settings Modal -->
    <SettingsModal 
      :is-open="showSettingsModal"
      @close="showSettingsModal = false"
    />
  </div>
</template>
