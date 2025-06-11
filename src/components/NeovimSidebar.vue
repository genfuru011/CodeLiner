<template>
  <div class="neovim-sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="header-title">
        <span class="tree-icon">🌳</span>
        <span v-if="!isCollapsed" class="title-text">Neo-tree</span>
      </div>
      <button 
        v-if="!isCollapsed" 
        class="collapse-btn"
        @click="$emit('toggle')"
      >
        ✕
      </button>
    </div>

    <!-- File tree -->
    <div v-if="!isCollapsed" class="file-tree">
      <!-- Current directory -->
      <div class="current-dir">
        <span class="dir-icon">📁</span>
        <span class="dir-path">{{ currentDirectory }}</span>
      </div>

      <!-- Tree items -->
      <div class="tree-items">
        <div
          v-for="item in fileTree"
          :key="item.path"
          :class="[
            'tree-item',
            {
              'selected': item.path === selectedFile,
              'directory': item.type === 'directory',
              'expanded': item.expanded
            }
          ]"
          :style="{ paddingLeft: `${item.depth * 16 + 8}px` }"
          @click="handleItemClick(item)"
        >
          <!-- Expand/collapse arrow for directories -->
          <span 
            v-if="item.type === 'directory'" 
            class="expand-arrow"
          >
            {{ item.expanded ? '▼' : '▶' }}
          </span>
          
          <!-- File/folder icon -->
          <FileIcon 
            :fileName="item.name" 
            :is-directory="item.type === 'directory'"
            :size="16"
          />
          
          <!-- File/folder name -->
          <span class="item-name">{{ item.name }}</span>
          
          <!-- Git status indicator -->
          <span 
            v-if="item.gitStatus" 
            :class="['git-status', `git-${item.gitStatus}`]"
          >
            {{ getGitStatusSymbol(item.gitStatus) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Collapsed state -->
    <div v-else class="collapsed-content">
      <button 
        class="expand-btn"
        @click="$emit('toggle')"
        title="Expand Neo-tree"
      >
        📁
      </button>
    </div>

    <!-- Bottom actions -->
    <div v-if="!isCollapsed" class="sidebar-actions">
      <button 
        class="action-btn" 
        @click="$emit('new-file')"
        title="New file"
      >
        📄+
      </button>
      <button 
        class="action-btn" 
        @click="$emit('new-folder')"
        title="New folder"
      >
        📁+
      </button>
      <button 
        class="action-btn" 
        @click="$emit('refresh')"
        title="Refresh"
      >
        🔄
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileIcon from './FileIcon.vue'

interface FileTreeItem {
  name: string
  path: string
  type: 'file' | 'directory'
  depth: number
  expanded?: boolean
  gitStatus?: 'modified' | 'added' | 'deleted' | 'untracked'
  children?: FileTreeItem[]
}

interface Props {
  isCollapsed: boolean
  fileTree: FileTreeItem[]
  selectedFile?: string
  currentDirectory: string
}

defineProps<Props>()

// Emit events properly
const $emit = defineEmits<{
  toggle: []
  'file-select': [path: string]
  'folder-toggle': [path: string]
  'new-file': []
  'new-folder': []
  refresh: []
}>()

const handleItemClick = (item: FileTreeItem) => {
  if (item.type === 'directory') {
    // Toggle directory expansion
    $emit('folder-toggle', item.path)
  } else {
    // Select file
    $emit('file-select', item.path)
  }
}

const getGitStatusSymbol = (status: string) => {
  const symbols: Record<string, string> = {
    modified: 'M',
    added: 'A',
    deleted: 'D',
    untracked: '?'
  }
  return symbols[status] || '?'
}
</script>

<style scoped>
.neovim-sidebar {
  background: var(--nvim-bg-alt);
  border-right: 1px solid var(--nvim-border);
  height: 100%;
  width: 280px;
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
}

.neovim-sidebar.collapsed {
  width: 48px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--nvim-border);
  background: var(--nvim-bg-dark);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--nvim-blue);
  font-weight: 600;
  font-size: 13px;
}

.tree-icon {
  font-size: 16px;
}

.title-text {
  color: var(--nvim-fg);
}

.collapse-btn {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background: var(--nvim-selection);
  color: var(--nvim-fg);
}

.file-tree {
  flex: 1;
  overflow-y: auto;
}

.current-dir {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--nvim-bg);
  border-bottom: 1px solid var(--nvim-border);
  font-size: 12px;
  color: var(--nvim-fg-alt);
}

.dir-icon {
  font-size: 14px;
}

.dir-path {
  font-family: monospace;
  color: var(--nvim-cyan);
}

.tree-items {
  padding: 4px 0;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--nvim-fg);
  transition: background-color 0.2s;
  user-select: none;
}

.tree-item:hover {
  background: var(--nvim-selection);
}

.tree-item.selected {
  background: var(--nvim-blue);
  color: var(--nvim-bg);
}

.tree-item.directory {
  font-weight: 500;
}

.expand-arrow {
  font-size: 10px;
  color: var(--nvim-fg-dim);
  width: 12px;
  text-align: center;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.git-status {
  font-size: 10px;
  font-weight: bold;
  width: 12px;
  text-align: center;
}

.git-modified {
  color: var(--nvim-orange);
}

.git-added {
  color: var(--nvim-green);
}

.git-deleted {
  color: var(--nvim-red);
}

.git-untracked {
  color: var(--nvim-purple);
}

.collapsed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
}

.expand-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.expand-btn:hover {
  background: var(--nvim-selection);
}

.sidebar-actions {
  display: flex;
  justify-content: space-around;
  padding: 8px;
  border-top: 1px solid var(--nvim-border);
  background: var(--nvim-bg-dark);
}

.action-btn {
  background: none;
  border: none;
  color: var(--nvim-fg-dim);
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--nvim-selection);
  color: var(--nvim-fg);
  transform: translateY(-1px);
}
</style>
