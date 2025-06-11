import { ref, computed, watch } from 'vue'

export interface Settings {
  sidebarWidth: number
  consoleWidth: number
  showSidebar: boolean
  showConsole: boolean
  theme: 'dark' | 'light'
  fontSize: number
  fontFamily: string
  showStatusBar: boolean
  autoSave: boolean
  tabSize: number
}

const DEFAULT_SETTINGS: Settings = {
  sidebarWidth: 300,
  consoleWidth: 400,
  showSidebar: true,
  showConsole: true,
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
  showStatusBar: true,
  autoSave: false,
  tabSize: 2
}

const STORAGE_KEY = 'codeliner-settings'

export function useSettings() {
  // Load settings from localStorage
  const loadSettings = (): Settings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
    }
    return DEFAULT_SETTINGS
  }

  // Save settings to localStorage
  const saveSettings = (settings: Settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  }

  // Reactive settings
  const settings = ref<Settings>(loadSettings())

  // Watch for changes and save automatically
  watch(settings, (newSettings) => {
    saveSettings(newSettings)
  }, { deep: true })

  // Individual setting getters and setters
  const sidebarWidth = computed({
    get: () => settings.value.sidebarWidth,
    set: (value: number) => {
      settings.value.sidebarWidth = Math.max(200, Math.min(600, value))
    }
  })

  const consoleWidth = computed({
    get: () => settings.value.consoleWidth,
    set: (value: number) => {
      settings.value.consoleWidth = Math.max(200, Math.min(800, value))
    }
  })

  const showSidebar = computed({
    get: () => settings.value.showSidebar,
    set: (value: boolean) => {
      settings.value.showSidebar = value
    }
  })

  const showConsole = computed({
    get: () => settings.value.showConsole,
    set: (value: boolean) => {
      settings.value.showConsole = value
    }
  })

  const theme = computed({
    get: () => settings.value.theme,
    set: (value: 'dark' | 'light') => {
      settings.value.theme = value
    }
  })

  const fontSize = computed({
    get: () => settings.value.fontSize,
    set: (value: number) => {
      settings.value.fontSize = Math.max(10, Math.min(24, value))
    }
  })

  const fontFamily = computed({
    get: () => settings.value.fontFamily,
    set: (value: string) => {
      settings.value.fontFamily = value
    }
  })

  const showStatusBar = computed({
    get: () => settings.value.showStatusBar,
    set: (value: boolean) => {
      settings.value.showStatusBar = value
    }
  })

  const autoSave = computed({
    get: () => settings.value.autoSave,
    set: (value: boolean) => {
      settings.value.autoSave = value
    }
  })

  const tabSize = computed({
    get: () => settings.value.tabSize,
    set: (value: number) => {
      settings.value.tabSize = Math.max(1, Math.min(8, value))
    }
  })

  // Reset to defaults
  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
  }

  // Export settings for backup
  const exportSettings = () => {
    return JSON.stringify(settings.value, null, 2)
  }

  // Import settings from backup
  const importSettings = (settingsJson: string) => {
    try {
      const imported = JSON.parse(settingsJson)
      settings.value = { ...DEFAULT_SETTINGS, ...imported }
      return true
    } catch (error) {
      console.error('Failed to import settings:', error)
      return false
    }
  }

  return {
    settings: settings.value,
    sidebarWidth,
    consoleWidth,
    showSidebar,
    showConsole,
    theme,
    fontSize,
    fontFamily,
    showStatusBar,
    autoSave,
    tabSize,
    resetSettings,
    exportSettings,
    importSettings
  }
}
