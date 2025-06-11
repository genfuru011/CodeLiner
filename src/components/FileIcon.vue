<template>
  <span 
    class="file-icon inline-flex items-center justify-center"
    :style="iconStyle"
  >
    <!-- SVGアイコンの場合 -->
    <img 
      v-if="fileIcon.type === 'svg'"
      :src="fileIcon.icon"
      :alt="`${fileName} icon`"
      class="svg-icon"
    />
    <!-- emojiアイコンの場合 -->
    <span v-else>{{ fileIcon.icon }}</span>
  </span>
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
  fontSize: `${props.size}px`,
  lineHeight: '1',
  // SVGアイコンの場合は色をSVG内で管理するため、emojiの場合のみ色を適用
  ...(fileIcon.value.type === 'emoji' && { color: fileIcon.value.color })
}))
</script>

<style scoped>
.file-icon {
  flex-shrink: 0;
}

.svg-icon {
  width: 1em;
  height: 1em;
  object-fit: contain;
  display: block;
}
</style>