<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-dark-border">
        <h2 class="text-xl font-semibold text-dark-text">Settings</h2>
        <button 
          @click="$emit('close')"
          class="text-dark-text-muted hover:text-dark-text transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Settings Content -->
      <div class="p-6 space-y-8">
        <!-- Display Settings -->
        <section>
          <h3 class="text-lg font-medium text-dark-text mb-4">Display</h3>
          <div class="space-y-4">
            <!-- Status Bar Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Status Bar</label>
                <p class="text-dark-text-muted text-sm">Show file info, cursor position, and execution status</p>
              </div>
              <button
                @click="toggleStatusBar"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  showStatusBar ? 'bg-accent' : 'bg-dark-border'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    showStatusBar ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Auto Save Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Auto Save</label>
                <p class="text-dark-text-muted text-sm">Automatically save changes</p>
              </div>
              <button
                @click="toggleAutoSave"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  autoSave ? 'bg-accent' : 'bg-dark-border'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    autoSave ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Theme Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Theme</label>
                <p class="text-dark-text-muted text-sm">Choose between dark and light themes</p>
              </div>
              <select
                v-model="theme"
                class="bg-dark-bg border border-dark-border rounded px-3 py-1 text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Editor Settings -->
        <section>
          <h3 class="text-lg font-medium text-dark-text mb-4">Editor</h3>
          <div class="space-y-4">
            <!-- Font Size -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Font Size</label>
                <p class="text-dark-text-muted text-sm">Editor font size (10-24px)</p>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="fontSize"
                  type="range"
                  min="10"
                  max="24"
                  class="flex-1 accent-accent"
                />
                <span class="text-dark-text w-8 text-right">{{ fontSize }}</span>
              </div>
            </div>

            <!-- Font Family -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Font Family</label>
                <p class="text-dark-text-muted text-sm">Editor font family</p>
              </div>
              <select
                v-model="fontFamily"
                class="bg-dark-bg border border-dark-border rounded px-3 py-1 text-dark-text focus:outline-none focus:ring-2 focus:ring-accent min-w-48"
              >
                <option value="JetBrains Mono, Monaco, Consolas, monospace">JetBrains Mono</option>
                <option value="Fira Code, Monaco, Consolas, monospace">Fira Code</option>
                <option value="Monaco, Consolas, monospace">Monaco</option>
                <option value="Consolas, monospace">Consolas</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <!-- Tab Size -->
            <div class="flex items-center justify-between">
              <div>
                <label class="text-dark-text font-medium">Tab Size</label>
                <p class="text-dark-text-muted text-sm">Number of spaces per tab</p>
              </div>
              <select
                v-model.number="tabSize"
                class="bg-dark-bg border border-dark-border rounded px-3 py-1 text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option :value="2">2 spaces</option>
                <option :value="4">4 spaces</option>
                <option :value="8">8 spaces</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Panel Settings -->
        <section>
          <h3 class="text-lg font-medium text-dark-text mb-4">Panels</h3>
          <div class="space-y-4">
            <!-- Default Panel Widths -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-dark-text font-medium block mb-2">Sidebar Width</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model.number="sidebarWidth"
                    type="range"
                    min="200"
                    max="600"
                    class="flex-1 accent-accent"
                  />
                  <span class="text-dark-text w-12 text-right">{{ sidebarWidth }}px</span>
                </div>
              </div>
              
              <div>
                <label class="text-dark-text font-medium block mb-2">Console Width</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model.number="consoleWidth"
                    type="range"
                    min="200"
                    max="800"
                    class="flex-1 accent-accent"
                  />
                  <span class="text-dark-text w-12 text-right">{{ consoleWidth }}px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <section class="border-t border-dark-border pt-6">
          <div class="flex justify-between">
            <button
              @click="resetSettings"
              class="px-4 py-2 text-dark-text-muted hover:text-dark-text border border-dark-border rounded hover:border-dark-text-muted transition-colors"
            >
              Reset to Defaults
            </button>
            
            <div class="space-x-3">
              <button
                @click="exportSettings"
                class="px-4 py-2 text-dark-text bg-dark-bg border border-dark-border rounded hover:border-accent transition-colors"
              >
                Export Settings
              </button>
              <button
                @click="$emit('close')"
                class="px-4 py-2 text-white bg-accent rounded hover:bg-accent/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettings } from '../composables/useSettings'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()

const { 
  showStatusBar, 
  autoSave, 
  theme, 
  fontSize, 
  fontFamily, 
  tabSize,
  sidebarWidth,
  consoleWidth,
  resetSettings: resetToDefaults,
  exportSettings: exportToJson
} = useSettings()

// Toggle functions
const toggleStatusBar = () => {
  showStatusBar.value = !showStatusBar.value
}

const toggleAutoSave = () => {
  autoSave.value = !autoSave.value
}

// Actions
const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    resetToDefaults()
  }
}

const exportSettings = () => {
  const settingsJson = exportToJson()
  const blob = new Blob([settingsJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'codeliner-settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
