import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const windowWidth = ref(0)
  const windowHeight = ref(0)
  
  // ブレークポイント定義
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
  
  // デバイス判定
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  
  // レスポンシブ状態の更新
  const updateResponsiveState = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    
    isMobile.value = windowWidth.value < breakpoints.md
    isTablet.value = windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg
    isDesktop.value = windowWidth.value >= breakpoints.lg
  }
  
  // ウィンドウリサイズイベント
  const handleResize = () => {
    updateResponsiveState()
  }
  
  onMounted(() => {
    updateResponsiveState()
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  
  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints
  }
}
