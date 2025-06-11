<template>
  <div 
    v-if="isVisible" 
    class="command-line-overlay"
    @click="closeCommandLine"
  >
    <div class="command-line-container" @click.stop>
      <div class="command-prompt">
        <span class="prompt-symbol">:</span>
        <input
          ref="commandInput"
          v-model="command"
          class="command-input"
          placeholder="Enter command..."
          @keydown="handleKeydown"
          @input="updateSuggestions"
        />
      </div>
      
      <!-- Command suggestions -->
      <div v-if="suggestions.length > 0" class="command-suggestions">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.command"
          :class="[
            'suggestion-item',
            { 'active': index === selectedSuggestion }
          ]"
          @click="selectSuggestion(suggestion)"
        >
          <span class="suggestion-command">{{ suggestion.command }}</span>
          <span class="suggestion-description">{{ suggestion.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'

interface Command {
  command: string
  description: string
  action: () => void
}

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  close: []
  execute: [command: string]
}>()

const command = ref('')
const commandInput = ref<HTMLInputElement>()
const selectedSuggestion = ref(0)

// Neovim風のコマンド定義
const commands: Command[] = [
  { command: 'w', description: 'Save file', action: () => emit('execute', 'save') },
  { command: 'wa', description: 'Save all files', action: () => emit('execute', 'save-all') },
  { command: 'q', description: 'Quit', action: () => emit('execute', 'quit') },
  { command: 'wq', description: 'Save and quit', action: () => emit('execute', 'save-quit') },
  { command: 'e', description: 'Edit file', action: () => emit('execute', 'edit') },
  { command: 'split', description: 'Split window horizontally', action: () => emit('execute', 'split') },
  { command: 'vsplit', description: 'Split window vertically', action: () => emit('execute', 'vsplit') },
  { command: 'tabnew', description: 'New tab', action: () => emit('execute', 'new-tab') },
  { command: 'help', description: 'Show help', action: () => emit('execute', 'help') },
  { command: 'set number', description: 'Show line numbers', action: () => emit('execute', 'line-numbers') },
  { command: 'set nonumber', description: 'Hide line numbers', action: () => emit('execute', 'no-line-numbers') },
  { command: 'theme', description: 'Change theme', action: () => emit('execute', 'theme') },
]

const suggestions = computed(() => {
  if (!command.value) return []
  return commands.filter(cmd => 
    cmd.command.toLowerCase().includes(command.value.toLowerCase())
  ).slice(0, 8)
})

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      closeCommandLine()
      break
    case 'Enter':
      executeCommand()
      break
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestion.value = Math.min(
        selectedSuggestion.value + 1, 
        suggestions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestion.value = Math.max(selectedSuggestion.value - 1, 0)
      break
    case 'Tab':
      event.preventDefault()
      if (suggestions.value.length > 0) {
        command.value = suggestions.value[selectedSuggestion.value].command
      }
      break
  }
}

const executeCommand = () => {
  if (suggestions.value.length > 0 && selectedSuggestion.value < suggestions.value.length) {
    suggestions.value[selectedSuggestion.value].action()
  } else if (command.value) {
    emit('execute', command.value)
  }
  closeCommandLine()
}

const selectSuggestion = (suggestion: Command) => {
  suggestion.action()
  closeCommandLine()
}

const updateSuggestions = () => {
  selectedSuggestion.value = 0
}

const closeCommandLine = () => {
  command.value = ''
  selectedSuggestion.value = 0
  emit('close')
}

// Focus input when visible
const focusInput = async () => {
  if (props.isVisible) {
    await nextTick()
    commandInput.value?.focus()
  }
}

// Watch for visibility changes
onMounted(() => {
  if (props.isVisible) {
    focusInput()
  }
})

// Keyboard shortcuts
const handleGlobalKeydown = (event: KeyboardEvent) => {
  // Open command line with ':'
  if (event.key === ':' && !props.isVisible && event.target === document.body) {
    event.preventDefault()
    emit('execute', 'open-command-line')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// Watch for prop changes
import { watch } from 'vue'
watch(() => props.isVisible, focusInput)
</script>

<style scoped>
.command-line-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding-bottom: 20%;
}

.command-line-container {
  background: var(--nvim-bg);
  border: 1px solid var(--nvim-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  min-width: 500px;
  max-width: 80vw;
}

.command-prompt {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--nvim-border);
}

.prompt-symbol {
  color: var(--nvim-command);
  font-weight: bold;
  margin-right: 8px;
  font-size: 16px;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--nvim-fg);
  font-family: inherit;
  font-size: 14px;
}

.command-input::placeholder {
  color: var(--nvim-fg-dim);
}

.command-suggestions {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: var(--nvim-selection);
}

.suggestion-command {
  color: var(--nvim-blue);
  font-weight: 500;
}

.suggestion-description {
  color: var(--nvim-fg-dim);
  font-size: 12px;
}
</style>
