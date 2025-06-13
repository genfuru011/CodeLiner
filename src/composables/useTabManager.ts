/**
 * Tab Management System for CodeLiner
 * Handles multiple file tabs, switching, and tab operations
 */

import { ref, computed } from 'vue'
import type { FileData } from './useFileSystem'

export interface EditorTab {
  id: string
  fileId: string
  fileName: string
  filePath: string
  language: string
  isModified: boolean
  content: string
  cursorPosition: { line: number; column: number }
  scrollPosition: { top: number; left: number }
}

export function useTabManager() {
  const tabs = ref<Map<string, EditorTab>>(new Map())
  const activeTabId = ref<string>('')
  const tabOrder = ref<string[]>([])
  const maxTabs = ref(10) // Maximum number of open tabs

  // Computed properties
  const activeTabs = computed(() => {
    return tabOrder.value
      .map(id => tabs.value.get(id))
      .filter(Boolean) as EditorTab[]
  })

  const activeTab = computed(() => {
    return activeTabId.value ? tabs.value.get(activeTabId.value) : null
  })

  const hasUnsavedChanges = computed(() => {
    return Array.from(tabs.value.values()).some(tab => tab.isModified)
  })

  const tabCount = computed(() => tabs.value.size)

  // Tab operations
  const createTab = (fileData: FileData): string => {
    // Check if tab already exists
    const existingTab = Array.from(tabs.value.values())
      .find(tab => tab.fileId === fileData.id)
    
    if (existingTab) {
      setActiveTab(existingTab.id)
      return existingTab.id
    }

    // Check tab limit
    if (tabs.value.size >= maxTabs.value) {
      console.warn(`Maximum tab limit (${maxTabs.value}) reached`)
      return ''
    }

    const tabId = generateTabId()
    const newTab: EditorTab = {
      id: tabId,
      fileId: fileData.id,
      fileName: fileData.name,
      filePath: fileData.path,
      language: fileData.language,
      isModified: false,
      content: fileData.content,
      cursorPosition: { line: 1, column: 1 },
      scrollPosition: { top: 0, left: 0 }
    }

    tabs.value.set(tabId, newTab)
    tabOrder.value.push(tabId)
    setActiveTab(tabId)

    return tabId
  }

  const closeTab = (tabId: string): boolean => {
    const tab = tabs.value.get(tabId)
    if (!tab) return false

    // Check for unsaved changes
    if (tab.isModified) {
      const shouldClose = confirm(
        `"${tab.fileName}" has unsaved changes. Close anyway?`
      )
      if (!shouldClose) return false
    }

    // Remove from tabs and order
    tabs.value.delete(tabId)
    const orderIndex = tabOrder.value.indexOf(tabId)
    if (orderIndex !== -1) {
      tabOrder.value.splice(orderIndex, 1)
    }

    // If this was the active tab, switch to another
    if (activeTabId.value === tabId) {
      if (tabOrder.value.length > 0) {
        // Switch to the tab that was to the right, or leftmost if none
        const newActiveIndex = Math.min(orderIndex, tabOrder.value.length - 1)
        setActiveTab(tabOrder.value[newActiveIndex])
      } else {
        activeTabId.value = ''
      }
    }

    return true
  }

  const closeAllTabs = (): boolean => {
    const unsavedTabs = Array.from(tabs.value.values())
      .filter(tab => tab.isModified)

    if (unsavedTabs.length > 0) {
      const shouldClose = confirm(
        `${unsavedTabs.length} tab(s) have unsaved changes. Close all anyway?`
      )
      if (!shouldClose) return false
    }

    tabs.value.clear()
    tabOrder.value = []
    activeTabId.value = ''
    return true
  }

  const closeOtherTabs = (keepTabId: string): boolean => {
    const otherTabs = Array.from(tabs.value.values())
      .filter(tab => tab.id !== keepTabId)
    
    const unsavedOthers = otherTabs.filter(tab => tab.isModified)
    
    if (unsavedOthers.length > 0) {
      const shouldClose = confirm(
        `${unsavedOthers.length} other tab(s) have unsaved changes. Close anyway?`
      )
      if (!shouldClose) return false
    }

    // Keep only the specified tab
    const keepTab = tabs.value.get(keepTabId)
    if (keepTab) {
      tabs.value.clear()
      tabs.value.set(keepTabId, keepTab)
      tabOrder.value = [keepTabId]
      setActiveTab(keepTabId)
    }

    return true
  }

  const setActiveTab = (tabId: string) => {
    if (tabs.value.has(tabId)) {
      activeTabId.value = tabId
    }
  }

  const updateTabContent = (tabId: string, content: string) => {
    const tab = tabs.value.get(tabId)
    if (tab) {
      tab.content = content
      tab.isModified = true
      
      // Update the tab in the map
      tabs.value.set(tabId, { ...tab })
    }
  }

  const markTabSaved = (tabId: string) => {
    const tab = tabs.value.get(tabId)
    if (tab) {
      tab.isModified = false
      tabs.value.set(tabId, { ...tab })
    }
  }

  const updateCursorPosition = (tabId: string, line: number, column: number) => {
    const tab = tabs.value.get(tabId)
    if (tab) {
      tab.cursorPosition = { line, column }
      tabs.value.set(tabId, { ...tab })
    }
  }

  const updateScrollPosition = (tabId: string, top: number, left: number) => {
    const tab = tabs.value.get(tabId)
    if (tab) {
      tab.scrollPosition = { top, left }
      tabs.value.set(tabId, { ...tab })
    }
  }

  // Tab navigation
  const switchToNextTab = () => {
    if (tabOrder.value.length <= 1) return
    
    const currentIndex = tabOrder.value.indexOf(activeTabId.value)
    const nextIndex = (currentIndex + 1) % tabOrder.value.length
    setActiveTab(tabOrder.value[nextIndex])
  }

  const switchToPreviousTab = () => {
    if (tabOrder.value.length <= 1) return
    
    const currentIndex = tabOrder.value.indexOf(activeTabId.value)
    const prevIndex = currentIndex === 0 ? tabOrder.value.length - 1 : currentIndex - 1
    setActiveTab(tabOrder.value[prevIndex])
  }

  const moveTab = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= tabOrder.value.length ||
        toIndex < 0 || toIndex >= tabOrder.value.length) {
      return
    }

    const tabId = tabOrder.value.splice(fromIndex, 1)[0]
    tabOrder.value.splice(toIndex, 0, tabId)
  }

  // Utility functions
  const generateTabId = (): string => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const getTabByFileId = (fileId: string): EditorTab | null => {
    return Array.from(tabs.value.values())
      .find(tab => tab.fileId === fileId) || null
  }

  const renameTab = (tabId: string, newName: string, newPath: string) => {
    const tab = tabs.value.get(tabId)
    if (tab) {
      tab.fileName = newName
      tab.filePath = newPath
      tabs.value.set(tabId, { ...tab })
    }
  }

  // Keyboard shortcuts
  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    // Ctrl/Cmd + W: Close current tab
    if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
      event.preventDefault()
      if (activeTabId.value) {
        closeTab(activeTabId.value)
      }
    }
    
    // Ctrl/Cmd + Shift + W: Close all tabs
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'W') {
      event.preventDefault()
      closeAllTabs()
    }
    
    // Ctrl/Cmd + Tab: Next tab
    if ((event.ctrlKey || event.metaKey) && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      switchToNextTab()
    }
    
    // Ctrl/Cmd + Shift + Tab: Previous tab
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Tab') {
      event.preventDefault()
      switchToPreviousTab()
    }
    
    // Ctrl/Cmd + 1-9: Switch to tab by number
    if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
      event.preventDefault()
      const tabIndex = parseInt(event.key) - 1
      if (tabIndex < tabOrder.value.length) {
        setActiveTab(tabOrder.value[tabIndex])
      }
    }
  }

  // Save all modified tabs
  const saveAllTabs = async (saveFunction: (tab: EditorTab) => Promise<void>) => {
    const modifiedTabs = Array.from(tabs.value.values())
      .filter(tab => tab.isModified)

    for (const tab of modifiedTabs) {
      try {
        await saveFunction(tab)
        markTabSaved(tab.id)
      } catch (error) {
        console.error(`Failed to save tab ${tab.fileName}:`, error)
      }
    }
  }

  return {
    // State
    tabs,
    activeTabId,
    tabOrder,
    maxTabs,
    
    // Computed
    activeTabs,
    activeTab,
    hasUnsavedChanges,
    tabCount,
    
    // Tab operations
    createTab,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
    setActiveTab,
    renameTab,
    
    // Content management
    updateTabContent,
    markTabSaved,
    updateCursorPosition,
    updateScrollPosition,
    
    // Navigation
    switchToNextTab,
    switchToPreviousTab,
    moveTab,
    
    // Utility
    getTabByFileId,
    handleKeyboardShortcuts,
    saveAllTabs
  }
}
