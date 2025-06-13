/**
 * File Tree Integration for CodeLiner
 * Connects file system data to sidebar tree display
 */

import { ref, computed } from 'vue'
import { useFileSystem } from './useFileSystem'

export interface FileTreeItem {
  name: string
  path: string
  type: 'file' | 'directory'
  depth: number
  expanded?: boolean
  gitStatus?: 'modified' | 'added' | 'deleted' | 'untracked'
  children?: FileTreeItem[]
}

export function useFileTree() {
  const { fileList, folderList } = useFileSystem()
  
  // Tree state
  const expandedFolders = ref<Set<string>>(new Set())
  const rootPath = ref('/')
  
  // Convert file system data to tree structure
  const fileTree = computed<FileTreeItem[]>(() => {
    return buildTree(rootPath.value, 0)
  })

  // Build tree recursively
  const buildTree = (parentPath: string, depth: number): FileTreeItem[] => {
    const items: FileTreeItem[] = []
    
    // Add folders first
    folderList.value.forEach(folder => {
      if (getParentPath(folder.path) === parentPath) {
        const item: FileTreeItem = {
          name: folder.name,
          path: folder.path,
          type: 'directory',
          depth,
          expanded: expandedFolders.value.has(folder.path)
        }
        
        items.push(item)
        
        // Add children if expanded
        if (item.expanded) {
          const children = buildTree(folder.path, depth + 1)
          items.push(...children)
        }
      }
    })
    
    // Add files
    fileList.value.forEach(file => {
      if (getParentPath(file.path) === parentPath) {
        const item: FileTreeItem = {
          name: file.name,
          path: file.path,
          type: 'file',
          depth
        }
        
        items.push(item)
      }
    })
    
    return items.sort((a, b) => {
      // Folders first, then files, then alphabetical
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  // Helper to get parent path
  const getParentPath = (path: string): string => {
    if (path === '/') return ''
    const parts = path.split('/').filter(Boolean)
    if (parts.length <= 1) return '/'
    return '/' + parts.slice(0, -1).join('/')
  }

  // Toggle folder expansion
  const toggleFolder = (path: string) => {
    if (expandedFolders.value.has(path)) {
      expandedFolders.value.delete(path)
    } else {
      expandedFolders.value.add(path)
    }
  }

  // Expand all parent folders for a given path
  const expandToPath = (path: string) => {
    const parts = path.split('/').filter(Boolean)
    for (let i = 1; i <= parts.length; i++) {
      const folderPath = '/' + parts.slice(0, i).join('/')
      const folder = folderList.value.find(f => f.path === folderPath)
      if (folder) {
        expandedFolders.value.add(folderPath)
      }
    }
  }

  // Collapse all folders
  const collapseAll = () => {
    expandedFolders.value.clear()
  }

  // Expand all folders
  const expandAll = () => {
    folderList.value.forEach(folder => {
      expandedFolders.value.add(folder.path)
    })
  }

  // Find item by path
  const findItemByPath = (path: string): FileTreeItem | null => {
    const findInTree = (items: FileTreeItem[]): FileTreeItem | null => {
      for (const item of items) {
        if (item.path === path) return item
        if (item.children) {
          const found = findInTree(item.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findInTree(fileTree.value)
  }

  // Get all visible items (flattened tree)
  const visibleItems = computed<FileTreeItem[]>(() => {
    const flatten = (items: FileTreeItem[]): FileTreeItem[] => {
      const result: FileTreeItem[] = []
      for (const item of items) {
        result.push(item)
        if (item.type === 'directory' && item.expanded && item.children) {
          result.push(...flatten(item.children))
        }
      }
      return result
    }
    
    return flatten(fileTree.value)
  })

  // Initialize with some default expanded folders
  const initializeDefaultExpansion = () => {
    // Expand root and common folders
    expandedFolders.value.add('/')
    expandedFolders.value.add('/src')
    expandedFolders.value.add('/docs')
  }

  return {
    fileTree,
    visibleItems,
    expandedFolders,
    rootPath,
    toggleFolder,
    expandToPath,
    collapseAll,
    expandAll,
    findItemByPath,
    initializeDefaultExpansion
  }
}
