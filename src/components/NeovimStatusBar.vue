<template>
  <div class="neovim-statusline">
    <!-- Left section -->
    <div class="statusline-left">
      <!-- Mode indicator -->
      <div :class="['mode-indicator', `mode-${currentMode}`]">
        {{ modeDisplay }}
      </div>
      
      <!-- File info -->
      <div class="file-info">
        <span class="file-name">{{ fileName || 'No Name' }}</span>
        <span v-if="isModified" class="modified-indicator">[+]</span>
        <span v-if="isReadonly" class="readonly-indicator">[RO]</span>
      </div>
    </div>

    <!-- Center section -->
    <div class="statusline-center">
      <div class="git-info" v-if="gitBranch">
        <span class="git-icon">⎇</span>
        <span class="git-branch">{{ gitBranch }}</span>
        <span v-if="gitChanges" class="git-changes">{{ gitChanges }}</span>
      </div>
    </div>

    <!-- Right section -->
    <div class="statusline-right">
      <!-- File encoding -->
      <div class="encoding">{{ encoding }}</div>
      
      <!-- File type -->
      <div class="filetype">{{ fileType || 'text' }}</div>
      
      <!-- Cursor position -->
      <div class="position">
        {{ line }}:{{ column }}
      </div>
      
      <!-- Progress -->
      <div class="progress">
        {{ progressPercent }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentMode?: 'normal' | 'insert' | 'visual' | 'command'
  fileName?: string
  isModified?: boolean
  isReadonly?: boolean
  gitBranch?: string
  gitChanges?: string
  encoding?: string
  fileType?: string
  line?: number
  column?: number
  totalLines?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentMode: 'normal',
  encoding: 'utf-8',
  line: 1,
  column: 1,
  totalLines: 1
})

const modeDisplay = computed(() => {
  const modes = {
    normal: 'NORMAL',
    insert: 'INSERT',
    visual: 'VISUAL',
    command: 'COMMAND'
  }
  return modes[props.currentMode]
})

const progressPercent = computed(() => {
  if (!props.totalLines || props.totalLines === 0) return 0
  return Math.round((props.line / props.totalLines) * 100)
})
</script>

<style scoped>
.neovim-statusline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  background: var(--nvim-bg-alt);
  border-top: 1px solid var(--nvim-border);
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.statusline-left,
.statusline-center,
.statusline-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.statusline-left {
  flex: 1;
}

.statusline-center {
  flex: 1;
  justify-content: center;
}

.statusline-right {
  flex: 1;
  justify-content: flex-end;
  margin-right: 16px;
}

.mode-indicator {
  padding: 2px 8px;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mode-normal {
  background: var(--nvim-normal);
  color: var(--nvim-bg);
}

.mode-insert {
  background: var(--nvim-insert);
  color: var(--nvim-bg);
}

.mode-visual {
  background: var(--nvim-visual);
  color: var(--nvim-bg);
}

.mode-command {
  background: var(--nvim-command);
  color: var(--nvim-bg);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.file-name {
  color: var(--nvim-fg);
  font-weight: 500;
}

.modified-indicator {
  color: var(--nvim-orange);
  font-weight: bold;
}

.readonly-indicator {
  color: var(--nvim-red);
  font-weight: bold;
}

.git-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--nvim-purple);
}

.git-icon {
  font-size: 14px;
}

.git-branch {
  color: var(--nvim-fg-alt);
}

.git-changes {
  color: var(--nvim-orange);
  font-size: 10px;
}

.encoding,
.filetype,
.position,
.progress {
  color: var(--nvim-fg-alt);
  padding: 0 6px;
}

.position {
  color: var(--nvim-blue);
  font-weight: 500;
}

.progress {
  color: var(--nvim-green);
  font-weight: 500;
  min-width: 35px;
  text-align: right;
}

/* Separator lines */
.statusline-right > div:not(:last-child)::after {
  content: '│';
  color: var(--nvim-border);
  margin-left: 6px;
}
</style>
