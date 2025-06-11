import { ref, computed } from 'vue'

export function useStatusBar() {
  // カーソル位置情報
  const cursorLine = ref(1)
  const cursorColumn = ref(1)
  const totalLines = ref(1)
  
  // ファイル情報
  const fileLanguage = ref('javascript')
  const fileSize = ref(0)
  const encoding = ref('UTF-8')
  
  // 実行状態
  const isExecuting = ref(false)
  const lastExecutionTime = ref<Date | null>(null)
  
  // フォーマット済み情報
  const cursorPosition = computed(() => 
    `Ln ${cursorLine.value}, Col ${cursorColumn.value}`
  )
  
  const fileSizeFormatted = computed(() => {
    if (fileSize.value < 1024) return `${fileSize.value} B`
    if (fileSize.value < 1024 * 1024) return `${(fileSize.value / 1024).toFixed(1)} KB`
    return `${(fileSize.value / (1024 * 1024)).toFixed(1)} MB`
  })
  
  const lastExecutionFormatted = computed(() => {
    if (!lastExecutionTime.value) return ''
    return lastExecutionTime.value.toLocaleTimeString()
  })
  
  // カーソル位置更新
  const updateCursorPosition = (line: number, column: number) => {
    cursorLine.value = line
    cursorColumn.value = column
  }
  
  // ファイル情報更新
  const updateFileInfo = (content: string, language: string = 'javascript') => {
    fileSize.value = new Blob([content]).size
    totalLines.value = content.split('\n').length
    fileLanguage.value = language
  }
  
  // 実行状態更新
  const setExecuting = (executing: boolean) => {
    isExecuting.value = executing
    if (!executing) {
      lastExecutionTime.value = new Date()
    }
  }
  
  return {
    // State
    cursorLine,
    cursorColumn,
    totalLines,
    fileLanguage,
    fileSize,
    encoding,
    isExecuting,
    lastExecutionTime,
    
    // Computed
    cursorPosition,
    fileSizeFormatted,
    lastExecutionFormatted,
    
    // Methods
    updateCursorPosition,
    updateFileInfo,
    setExecuting
  }
}
