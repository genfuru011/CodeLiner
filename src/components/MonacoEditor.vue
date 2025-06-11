<template>
  <div ref="editorContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useSettings } from '../composables/useSettings'

interface Props {
  modelValue: string
  language?: string
  theme?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'save'): void
  (e: 'run'): void
  (e: 'cursorChange', line: number, column: number): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  theme: 'vs-dark'
})

const emit = defineEmits<Emits>()

const { fontSize, fontFamily, tabSize } = useSettings()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (editorContainer.value) {
    try {
      // Configure Monaco Editor theme
      monaco.editor.defineTheme('codeliner-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'a8abb2', fontStyle: 'italic' },
          { token: 'keyword', foreground: '4285f4' },
          { token: 'string', foreground: '81c784' },
          { token: 'number', foreground: 'ffb74d' },
          { token: 'function', foreground: '64b5f6' },
        ],
        colors: {
          'editor.background': '#00000000', // Transparent background
          'editor.foreground': '#e4e6ea',
          'editor.lineHighlightBackground': '#2a2b3520',
          'editor.selectionBackground': '#34364430',
          'editorCursor.foreground': '#4285f4',
          'editorLineNumber.foreground': '#a8abb2',
          'editorLineNumber.activeForeground': '#e4e6ea',
          'editor.selectionHighlightBackground': '#34364430',
          'editor.wordHighlightBackground': '#34364430',
        }
      })

      editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: props.language,
        theme: 'codeliner-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: fontSize.value,
        fontFamily: fontFamily.value,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        wordWrap: 'on'
      })

      // Add keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        emit('save')
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        emit('run')
      })

      // Set tab size
      editor.getModel()?.updateOptions({ tabSize: tabSize.value, insertSpaces: true })

      // Listen for content changes
      editor.onDidChangeModelContent(() => {
        if (editor) {
          emit('update:modelValue', editor.getValue())
        }
      })
      
      // Listen for cursor position changes
      editor.onDidChangeCursorPosition((e) => {
        emit('cursorChange', e.position.lineNumber, e.position.column)
      })
      
      // Watch for settings changes
      watch([fontSize, fontFamily, tabSize], () => {
        if (editor) {
          editor.updateOptions({
            fontSize: fontSize.value,
            fontFamily: fontFamily.value
          })
          editor.getModel()?.updateOptions({ 
            tabSize: tabSize.value, 
            insertSpaces: true 
          })
        }
      })
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error)
    }
  }
})

// Watch for external changes to the model value
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

// Watch for language changes
watch(() => props.language, (newLanguage) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLanguage)
    }
  }
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})
</script>
