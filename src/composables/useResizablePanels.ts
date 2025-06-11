import { ref, onMounted, onUnmounted } from 'vue'
import { useSettings } from './useSettings'

export function useResizablePanels() {
  const { sidebarWidth, consoleWidth } = useSettings()
  
  // ドラッグ状態
  const isDragging = ref(false)
  const dragTarget = ref<'sidebar' | 'console' | null>(null)
  
  // 最小・最大幅の制限
  const MIN_SIDEBAR_WIDTH = 200
  const MAX_SIDEBAR_WIDTH = 500
  const MIN_CONSOLE_WIDTH = 300
  const MAX_CONSOLE_WIDTH = 600
  
  // ドラッグ開始（マウス・タッチ両対応）
  const startDrag = (target: 'sidebar' | 'console', event: MouseEvent | TouchEvent) => {
    isDragging.value = true
    dragTarget.value = target
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    
    event.preventDefault()
  }
  
  // ドラッグ中（マウス・タッチ両対応）
  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !dragTarget.value) return
    
    // タッチイベントとマウスイベントの座標取得を統一
    const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX
    if (clientX === undefined) return
    
    if (dragTarget.value === 'sidebar') {
      // サイドバーのリサイズ
      const newWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, clientX)
      )
      sidebarWidth.value = newWidth
    } else if (dragTarget.value === 'console') {
      // コンソールのリサイズ（右端からの距離で計算）
      const windowWidth = window.innerWidth
      const newWidth = Math.max(
        MIN_CONSOLE_WIDTH,
        Math.min(MAX_CONSOLE_WIDTH, windowWidth - clientX)
      )
      consoleWidth.value = newWidth
    }
  }
  
  // ドラッグ終了
  const stopDrag = () => {
    isDragging.value = false
    dragTarget.value = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  
  // イベントリスナーの登録（マウス・タッチ両対応）
  onMounted(() => {
    // マウスイベント
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    
    // タッチイベント
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('touchend', stopDrag)
  })
  
  onUnmounted(() => {
    // マウスイベント
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    
    // タッチイベント
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', stopDrag)
  })
  
  return {
    sidebarWidth,
    consoleWidth,
    isDragging,
    dragTarget,
    startDrag
  }
}
