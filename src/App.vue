<script setup lang="ts">
import { ref } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'

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

// Functions
const saveFile = () => {
  // TODO: Implement file saving functionality
  console.log('File saved:', activeFile.value)
}

const runCode = () => {
  // Simple JavaScript execution (for demo purposes)
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
  }
}
</script>

<template>
  <div class="min-h-screen bg-dark-bg text-dark-text font-mono">
    <!-- Header -->
    <header class="bg-dark-surface border-b border-dark-border px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-accent">CodeLiner</h1>
          <nav class="flex space-x-4 text-sm">
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">File</button>
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">Edit</button>
            <button class="text-dark-text-muted hover:text-dark-text transition-colors">View</button>
          </nav>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="runCode" class="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded text-sm transition-colors">
            Run Code
          </button>
          <button class="px-3 py-1 bg-dark-surface-hover hover:bg-dark-border text-dark-text rounded text-sm transition-colors">
            Share
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-60px)]">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-surface border-r border-dark-border">
        <div class="p-4">
          <h2 class="text-sm font-semibold text-dark-text-muted mb-3">Explorer</h2>
          <div class="space-y-1">
            <div class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <span class="text-accent text-xs">●</span>
              <span class="text-sm">{{ activeFile }}</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <span class="text-dark-text-muted text-xs">○</span>
              <span class="text-sm text-dark-text-muted">style.css</span>
            </div>
            <div class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-dark-surface-hover cursor-pointer transition-colors">
              <span class="text-dark-text-muted text-xs">○</span>
              <span class="text-sm text-dark-text-muted">package.json</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Editor Area -->
      <main class="flex-1 flex flex-col">
        <!-- Tab Bar -->
        <div class="bg-dark-surface border-b border-dark-border px-4">
          <div class="flex">
            <div class="px-4 py-2 bg-dark-bg text-dark-text text-sm border-r border-dark-border flex items-center">
              {{ activeFile }}
              <button class="ml-2 text-dark-text-muted hover:text-dark-text transition-colors">×</button>
            </div>
          </div>
        </div>

        <!-- Code Editor Area -->
        <div class="flex-1 relative bg-dark-bg">
          <MonacoEditor 
            v-model="code" 
            language="javascript" 
            class="absolute inset-0"
            @save="saveFile"
            @run="runCode"
          />
        </div>
      </main>

      <!-- Output Panel -->
      <aside class="w-96 bg-dark-surface border-l border-dark-border flex flex-col">
        <div class="border-b border-dark-border px-4 py-2">
          <h2 class="text-sm font-semibold text-dark-text-muted">Console</h2>
        </div>
        <div class="flex-1 p-4">
          <div class="bg-dark-bg p-3 rounded border border-dark-border font-mono text-sm h-full overflow-auto">
            <pre class="text-green-400 whitespace-pre-wrap">{{ output }}</pre>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
