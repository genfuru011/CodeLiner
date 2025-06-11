<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-dark-surface border-2 border-accent rounded-lg w-full max-w-2xl mx-4 shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-dark-border">
        <h2 class="text-lg font-semibold text-accent">Settings</h2>
        <button 
          @click="$emit('close')"
          class="text-dark-text-muted hover:text-accent transition-colors"
        >
          x
        </button>
      </div>

      <!-- Settings Content -->
      <div class="p-4 space-y-6 max-h-96 overflow-y-auto">
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

            <!-- Background Opacity -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <label class="text-dark-text text-sm font-medium">Background Opacity</label>
                <p class="text-dark-text-muted text-xs">Transparency level ({{ Math.round(backgroundOpacity * 100) }}%)</p>
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="range"
                  v-model.number="backgroundOpacity"
                  min="0.5"
                  max="1"
                  step="0.05"
                  class="w-20 h-1 bg-dark-border rounded-lg appearance-none cursor-pointer slider"
                />
                <span class="text-xs text-dark-text-muted w-8 text-right">{{ Math.round(backgroundOpacity * 100) }}%</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-4 border-t border-dark-border">
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
  backgroundOpacity,
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
/* Slider styling for background opacity */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--nvim-blue);
  cursor: pointer;
  border: 2px solid var(--nvim-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: var(--nvim-border);
  border-radius: 2px;
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--nvim-blue);
  cursor: pointer;
  border: 2px solid var(--nvim-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: var(--nvim-border);
  border-radius: 2px;
}
</style>

