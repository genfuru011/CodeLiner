<template>
  <footer class="bg-dark-surface border-t border-dark-border px-4 py-1 text-xs">
    <div class="flex items-center justify-between">
      <!-- Left side - File info -->
      <div class="flex items-center space-x-4 text-dark-text-muted">
        <div class="flex items-center space-x-1">
          <span class="w-2 h-2 rounded-full bg-accent"></span>
          <span>{{ activeFile }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
          </svg>
          <span>{{ fileLanguage.toUpperCase() }}</span>
        </div>
        
        <div>{{ fileSizeFormatted }}</div>
        
        <div v-if="totalLines > 1">{{ totalLines }} lines</div>
      </div>
      
      <!-- Center - Execution status -->
      <div class="flex items-center space-x-3 text-dark-text-muted">
        <div v-if="isExecuting" class="flex items-center space-x-1 text-accent">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span>Executing...</span>
        </div>
        
        <div v-else-if="lastExecutionFormatted" class="flex items-center space-x-1">
          <svg class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Last run: {{ lastExecutionFormatted }}</span>
        </div>
      </div>
      
      <!-- Right side - Cursor position and device info -->
      <div class="flex items-center space-x-4 text-dark-text-muted">
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ cursorPosition }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>{{ encoding }}</span>
        </div>
        
        <div v-if="deviceInfo" class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>{{ deviceInfo }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>{{ windowWidth }}×{{ windowHeight }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  activeFile: string
  fileLanguage: string
  fileSizeFormatted: string
  totalLines: number
  isExecuting: boolean
  lastExecutionFormatted: string
  cursorPosition: string
  encoding: string
  windowWidth: number
  windowHeight: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const props = defineProps<Props>()

// デバイス情報の表示
const deviceInfo = computed(() => {
  if (props.isMobile) return 'Mobile'
  if (props.isTablet) return 'Tablet'
  if (props.isDesktop) return 'Desktop'
  return ''
})
</script>
