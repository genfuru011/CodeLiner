<template>
  <img 
    :src="fileIcon.icon"
    :alt="`${fileName} icon`"
    class="file-icon flex-shrink-0"
    :style="iconStyle"
    loading="lazy"
    @error="onImageError"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFileIcons, type FileIcon } from '../composables/useFileIcons'

interface Props {
  fileName: string
  isDirectory?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  isDirectory: false,
  size: 16
})

const { getFileIcon } = useFileIcons()

// ファイルアイコン情報を取得
const fileIcon = computed<FileIcon>(() => 
  getFileIcon(props.fileName, props.isDirectory)
)

// アイコンのスタイル
const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  filter: `brightness(1.1) saturate(1.1)`,
  color: fileIcon.value.color
}))

// 画像読み込みエラー時のフォールバック
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // フォールバックアイコンを設定
  img.src = '/src/assets/icons/file.svg'
}
</script>

<style scoped>
.file-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.file-icon:hover {
  transform: scale(1.05);
  filter: brightness(1.2) saturate(1.2);
}
</style>