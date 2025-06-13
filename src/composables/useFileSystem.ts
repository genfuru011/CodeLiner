/**
 * File System Management for CodeLiner
 * Provides file operations with persistence using IndexedDB
 */

import { ref, computed } from 'vue'

export interface FileData {
  id: string
  name: string
  path: string
  content: string
  language: string
  lastModified: Date
  size: number
}

export interface FolderData {
  id: string
  name: string
  path: string
  parentId?: string
  children: string[] // Array of file/folder IDs
  expanded: boolean
}

export interface FileSystemItem {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  parentId?: string
  lastModified: Date
}

const DB_NAME = 'CodeLinerFileSystem'
const DB_VERSION = 1
const FILES_STORE = 'files'
const FOLDERS_STORE = 'folders'

export function useFileSystem() {
  const currentFiles = ref<Map<string, FileData>>(new Map())
  const currentFolders = ref<Map<string, FolderData>>(new Map())
  const activeFileId = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string>('')

  // IndexedDB connection
  let db: IDBDatabase | null = null

  // Initialize database
  const initDB = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => {
        error.value = 'Failed to open database'
        reject(new Error('Failed to open database'))
      }
      
      request.onsuccess = () => {
        db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result
        
        // Create files store
        if (!database.objectStoreNames.contains(FILES_STORE)) {
          const filesStore = database.createObjectStore(FILES_STORE, { keyPath: 'id' })
          filesStore.createIndex('path', 'path', { unique: true })
          filesStore.createIndex('name', 'name', { unique: false })
        }
        
        // Create folders store
        if (!database.objectStoreNames.contains(FOLDERS_STORE)) {
          const foldersStore = database.createObjectStore(FOLDERS_STORE, { keyPath: 'id' })
          foldersStore.createIndex('path', 'path', { unique: true })
          foldersStore.createIndex('parentId', 'parentId', { unique: false })
        }
      }
    })
  }

  // Generate unique ID
  // File operations
  const saveFile = async (fileData: Omit<FileData, 'id' | 'lastModified' | 'size'>): Promise<string> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const file: FileData = {
        ...fileData,
        id: fileData.path, // Use path as ID for uniqueness
        lastModified: new Date(),
        size: new Blob([fileData.content]).size
      }
      
      const transaction = db!.transaction([FILES_STORE], 'readwrite')
      const store = transaction.objectStore(FILES_STORE)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(file)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to save file'))
      })
      
      currentFiles.value.set(file.id, file)
      return file.id
    } catch (err) {
      error.value = `Failed to save file: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadFile = async (fileId: string): Promise<FileData | null> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const transaction = db!.transaction([FILES_STORE], 'readonly')
      const store = transaction.objectStore(FILES_STORE)
      
      const file = await new Promise<FileData | null>((resolve, reject) => {
        const request = store.get(fileId)
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(new Error('Failed to load file'))
      })
      
      if (file) {
        currentFiles.value.set(file.id, file)
      }
      
      return file
    } catch (err) {
      error.value = `Failed to load file: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteFile = async (fileId: string): Promise<void> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const transaction = db!.transaction([FILES_STORE], 'readwrite')
      const store = transaction.objectStore(FILES_STORE)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(fileId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to delete file'))
      })
      
      currentFiles.value.delete(fileId)
    } catch (err) {
      error.value = `Failed to delete file: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getAllFiles = async (): Promise<FileData[]> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const transaction = db!.transaction([FILES_STORE], 'readonly')
      const store = transaction.objectStore(FILES_STORE)
      
      const files = await new Promise<FileData[]>((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error('Failed to load files'))
      })
      
      // Update current files map
      currentFiles.value.clear()
      files.forEach(file => {
        currentFiles.value.set(file.id, file)
      })
      
      return files
    } catch (err) {
      error.value = `Failed to load files: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Folder operations
  const createFolder = async (folderData: Omit<FolderData, 'id'>): Promise<string> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const folder: FolderData = {
        ...folderData,
        id: folderData.path, // Use path as ID for uniqueness
      }
      
      const transaction = db!.transaction([FOLDERS_STORE], 'readwrite')
      const store = transaction.objectStore(FOLDERS_STORE)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(folder)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to create folder'))
      })
      
      currentFolders.value.set(folder.id, folder)
      return folder.id
    } catch (err) {
      error.value = `Failed to create folder: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getAllFolders = async (): Promise<FolderData[]> => {
    if (!db) await initDB()
    
    isLoading.value = true
    error.value = ''
    
    try {
      const transaction = db!.transaction([FOLDERS_STORE], 'readonly')
      const store = transaction.objectStore(FOLDERS_STORE)
      
      const folders = await new Promise<FolderData[]>((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error('Failed to load folders'))
      })
      
      // Update current folders map
      currentFolders.value.clear()
      folders.forEach(folder => {
        currentFolders.value.set(folder.id, folder)
      })
      
      return folders
    } catch (err) {
      error.value = `Failed to load folders: ${err}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const currentFile = computed(() => {
    return activeFileId.value ? currentFiles.value.get(activeFileId.value) : null
  })

  const fileList = computed(() => {
    return Array.from(currentFiles.value.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  })

  const folderList = computed(() => {
    return Array.from(currentFolders.value.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  })

  // Utility functions
  const setActiveFile = (fileId: string) => {
    activeFileId.value = fileId
  }

  const createNewFile = async (name: string, path: string, content: string = ''): Promise<string> => {
    const language = getLanguageFromPath(path)
    return await saveFile({
      name,
      path,
      content,
      language
    })
  }

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'vue': 'vue',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'py': 'python',
      'json': 'json',
      'md': 'markdown'
    }
    return languageMap[extension || ''] || 'plaintext'
  }

  // Initialize on first use
  const init = async () => {
    await initDB()
    await getAllFiles()
    await getAllFolders()
  }

  return {
    // State
    currentFiles,
    currentFolders,
    activeFileId,
    isLoading,
    error,
    
    // Computed
    currentFile,
    fileList,
    folderList,
    
    // File operations
    saveFile,
    loadFile,
    deleteFile,
    getAllFiles,
    createNewFile,
    
    // Folder operations
    createFolder,
    getAllFolders,
    
    // Utility
    setActiveFile,
    getLanguageFromPath,
    init
  }
}
