<template>
  <div class="tab-bar">
    <!-- No tabs state -->
    <div v-if="activeTabs.length === 0" class="no-tabs">
      <span class="no-tabs-text">No files open</span>
    </div>
    
    <!-- Active tabs -->
    <div v-else class="tabs-container">
      <div
        v-for="tab in activeTabs"
        :key="tab.id"
        :class="[
          'tab',
          { 
            'active': tab.id === activeTabId,
            'modified': tab.isModified
          }
        ]"
        @click="setActiveTab(tab.id)"
        @mousedown.middle="closeTab(tab.id)"
        @contextmenu.prevent="showContextMenu(tab.id, $event)"
      >
        <!-- File icon -->
        <FileIcon 
          :fileName="tab.fileName" 
          :size="16" 
          class="tab-icon"
        />
        
        <!-- File name -->
        <span class="tab-name" :title="tab.filePath">
          {{ tab.fileName }}
        </span>
        
        <!-- Modified indicator -->
        <span v-if="tab.isModified" class="modified-indicator" title="Modified">
          •
        </span>
        
        <!-- Close button -->
        <button
          class="tab-close"
          @click.stop="closeTab(tab.id)"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
    
    <!-- Tab actions -->
    <div class="tab-actions">
      <button
        class="tab-action-btn"
        @click="$emit('new-file')"
        title="New file (Ctrl+N)"
      >
        +
      </button>
      
      <button
        v-if="activeTabs.length > 1"
        class="tab-action-btn"
        @click="showTabMenu"
        title="Tab menu"
      >
        ▼
      </button>
    </div>

    <!-- Context menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click.stop
    >
      <button @click="closeTab(contextMenu.tabId)">Close</button>
      <button @click="closeOtherTabs(contextMenu.tabId)">Close Others</button>
      <button @click="closeTabsToRight(contextMenu.tabId)">Close to the Right</button>
      <hr>
      <button @click="copyPath(contextMenu.tabId)">Copy Path</button>
      <button @click="revealInSidebar(contextMenu.tabId)">Reveal in Sidebar</button>
    </div>

    <!-- Tab menu dropdown -->
    <div
      v-if="tabMenu.visible"
      class="tab-menu"
      :style="{ top: tabMenu.y + 'px', right: '10px' }"
    >
      <div class="tab-menu-header">Open Files ({{ activeTabs.length }})</div>
      <div class="tab-menu-items">
        <div
          v-for="tab in activeTabs"
          :key="tab.id"
          :class="['tab-menu-item', { active: tab.id === activeTabId }]"
          @click="setActiveTab(tab.id); hideTabMenu()"
        >
          <FileIcon :fileName="tab.fileName" :size="14" />
          <span class="tab-menu-name">{{ tab.fileName }}</span>
          <span v-if="tab.isModified" class="tab-menu-modified">•</span>
        </div>
      </div>
      <hr>
      <button @click="closeAllTabs(); hideTabMenu()">Close All</button>
    </div>

    <!-- Overlay for closing menus -->
    <div
      v-if="contextMenu.visible || tabMenu.visible"
      class="menu-overlay"
      @click="hideAllMenus"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FileIcon from './FileIcon.vue'
import { useTabManager } from '../composables/useTabManager'

interface Props {
  // Props can be added here if needed
}

interface Emits {
  'new-file': []
  'reveal-in-sidebar': [fileId: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  activeTabs,
  activeTabId,
  setActiveTab,
  closeTab,
  closeAllTabs,
  closeOtherTabs
} = useTabManager()

// Context menu state
const contextMenu = ref({
  visible: false,
  tabId: '',
  x: 0,
  y: 0
})

// Tab menu state
const tabMenu = ref({
  visible: false,
  y: 0
})

// Context menu handlers
const showContextMenu = (tabId: string, event: MouseEvent) => {
  contextMenu.value = {
    visible: true,
    tabId,
    x: event.clientX,
    y: event.clientY
  }
}

const hideContextMenu = () => {
  contextMenu.value.visible = false
}

// Tab menu handlers
const showTabMenu = () => {
  const rect = document.querySelector('.tab-actions')?.getBoundingClientRect()
  tabMenu.value = {
    visible: true,
    y: (rect?.bottom || 0) + 5
  }
}

const hideTabMenu = () => {
  tabMenu.value.visible = false
}

const hideAllMenus = () => {
  hideContextMenu()
  hideTabMenu()
}

// Context menu actions
const closeTabsToRight = (tabId: string) => {
  const tabIndex = activeTabs.value.findIndex(tab => tab.id === tabId)
  if (tabIndex !== -1) {
    const tabsToClose = activeTabs.value.slice(tabIndex + 1)
    tabsToClose.forEach(tab => closeTab(tab.id))
  }
  hideContextMenu()
}

const copyPath = (tabId: string) => {
  const tab = activeTabs.value.find(tab => tab.id === tabId)
  if (tab) {
    navigator.clipboard.writeText(tab.filePath)
  }
  hideContextMenu()
}

const revealInSidebar = (tabId: string) => {
  const tab = activeTabs.value.find(tab => tab.id === tabId)
  if (tab) {
    emit('reveal-in-sidebar', tab.fileId)
  }
  hideContextMenu()
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('.context-menu') && !target.closest('.tab-menu')) {
    hideAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  height: 32px;
  background: var(--nvim-bg-alt);
  border-bottom: 1px solid var(--nvim-border);
  position: relative;
  z-index: 10;
}

.no-tabs {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.no-tabs-text {
  color: var(--nvim-fg-dim);
  font-size: 12px;
  font-style: italic;
}

.tabs-container {
  display: flex;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  min-width: 120px;
  max-width: 200px;
  height: 100%;
  background: var(--nvim-bg-dark);
  border-right: 1px solid var(--nvim-border);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.tab:hover {
  background: var(--nvim-selection);
}

.tab.active {
  background: var(--nvim-bg);
  border-bottom: 2px solid var(--nvim-blue);
}

.tab.modified::before {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  background: var(--nvim-orange);
  border-radius: 50%;
  z-index: 1;
}

.tab-icon {
  flex-shrink: 0;
}

.tab-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--nvim-fg);
}

.modified-indicator {
  color: var(--nvim-orange);
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
}

.tab-close {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1;
  transition: all 0.2s ease;
  opacity: 0;
  flex-shrink: 0;
}

.tab:hover .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background: var(--nvim-red);
  color: var(--nvim-bg);
}

.tab-actions {
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
  border-left: 1px solid var(--nvim-border);
}

.tab-action-btn {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.tab-action-btn:hover {
  background: var(--nvim-selection);
  color: var(--nvim-fg);
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: var(--nvim-bg-alt);
  border: 1px solid var(--nvim-border);
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 160px;
  padding: 4px 0;
}

.context-menu button {
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: none;
  color: var(--nvim-fg);
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.context-menu button:hover {
  background: var(--nvim-selection);
}

.context-menu hr {
  margin: 4px 0;
  border: none;
  border-top: 1px solid var(--nvim-border);
}

/* Tab Menu */
.tab-menu {
  position: fixed;
  background: var(--nvim-bg-alt);
  border: 1px solid var(--nvim-border);
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.tab-menu-header {
  padding: 8px 12px;
  background: var(--nvim-bg-dark);
  border-bottom: 1px solid var(--nvim-border);
  font-size: 11px;
  font-weight: 600;
  color: var(--nvim-fg-alt);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-menu-items {
  padding: 4px 0;
}

.tab-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.tab-menu-item:hover {
  background: var(--nvim-selection);
}

.tab-menu-item.active {
  background: var(--nvim-blue);
  color: var(--nvim-bg);
}

.tab-menu-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-menu-modified {
  color: var(--nvim-orange);
  font-weight: bold;
}

.tab-menu button {
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  border-top: 1px solid var(--nvim-border);
  color: var(--nvim-fg);
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.tab-menu button:hover {
  background: var(--nvim-selection);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
