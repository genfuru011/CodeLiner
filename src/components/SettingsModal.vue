<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="settings-modal-bg border-2 border-accent rounded-lg w-full max-w-2xl mx-4 shadow-xl backdrop-blur-md">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-dark-border settings-header">
        <h2 class="text-lg font-semibold text-accent">Settings</h2>
        <button 
          @click="$emit('close')"
          class="text-dark-text-muted hover:text-accent transition-colors"
        >
          ×
        </button>
      </div>

      <!-- Settings Content -->
      <div class="p-4 space-y-6 max-h-96 overflow-y-auto settings-content">
        <!-- Editor Settings -->
        <section>
          <h3 class="text-accent font-medium mb-3 border-b border-dark-border pb-1">Editor</h3>
          <div class="space-y-3">
            <!-- Status Bar Toggle -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <label class="text-dark-text text-sm font-medium">Status Bar</label>
                <p class="text-dark-text-muted text-xs">Show cursor position and file info</p>
              </div>
              <button
                @click="toggleStatusBar"
                :class="[
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors border',
                  showStatusBar 
                    ? 'bg-accent border-accent' 
                    : 'bg-dark-bg border-dark-border'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                    showStatusBar ? 'translate-x-5' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Auto Save Toggle -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <label class="text-dark-text text-sm font-medium">Auto Save</label>
                <p class="text-dark-text-muted text-xs">Automatically save changes</p>
              </div>
              <button
                @click="toggleAutoSave"
                :class="[
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors border',
                  autoSave 
                    ? 'bg-accent border-accent' 
                    : 'bg-dark-bg border-dark-border'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                    autoSave ? 'translate-x-5' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </section>

        <!-- Appearance Settings -->
        <section>
          <h3 class="text-accent font-medium mb-3 border-b border-dark-border pb-1">Appearance</h3>
          <div class="space-y-3">
            <!-- Theme Selection -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <label class="text-dark-text text-sm font-medium">Theme</label>
                <p class="text-dark-text-muted text-xs">Choose color scheme</p>
              </div>
              <select
                v-model="theme"
                class="bg-dark-bg border border-dark-border rounded px-2 py-1 text-dark-text text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <!-- Font Size -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <label class="text-dark-text text-sm font-medium">Font Size</label>
                <p class="text-dark-text-muted text-xs">Editor font size</p>
              </div>
              <select
                v-model="fontSize"
                class="bg-dark-bg border border-dark-border rounded px-2 py-1 text-dark-text text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t border-dark-border settings-footer">
        <button
          @click="resetSettings"
          class="px-3 py-1 text-xs text-dark-text-muted hover:text-accent border border-dark-border rounded hover:border-accent transition-colors"
        >
          Reset
        </button>
        <button
          @click="$emit('close')"
          class="px-3 py-1 text-xs bg-accent text-dark-bg rounded hover:bg-green-400 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettings } from '../composables/useSettings'

interface Props {
  isOpen: boolean
}

defineProps<Props>()
defineEmits<{
  close: []
}>()

const {
  showStatusBar,
  autoSave,
  theme,
  fontSize,
  resetSettings
} = useSettings()

// トグル関数を定義
const toggleStatusBar = () => {
  showStatusBar.value = !showStatusBar.value
}

const toggleAutoSave = () => {
  autoSave.value = !autoSave.value
}
</script>

<style scoped>
/* Modal overlay with dynamic transparency */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, calc(0.3 + (1 - var(--bg-opacity)) * 0.4));
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Settings modal with transparency support */
.settings-modal-bg {
  background: var(--nvim-bg-alt);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(var(--nvim-blue), 0.3);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(var(--nvim-blue), 0.1);
}

.settings-header {
  background: rgba(var(--nvim-bg-dark-rgb), calc(var(--bg-opacity) + 0.1));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.settings-content {
  background: rgba(var(--nvim-bg-rgb), calc(var(--bg-opacity) - 0.05));
}

.settings-footer {
  background: rgba(var(--nvim-bg-dark-rgb), calc(var(--bg-opacity) + 0.05));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Enhanced glass effect for better visibility */
.settings-modal-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--nvim-blue), 0.03) 0%,
    transparent 50%,
    rgba(var(--nvim-purple), 0.03) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

/* Smooth transitions for transparency changes */
.settings-modal-bg,
.settings-header,
.settings-content,
.settings-footer {
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}
</style>

