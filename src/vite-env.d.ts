/// <reference types="vite/client" />

// SVGファイルの型定義
declare module '*.svg' {
  const content: string
  export default content
}

// 動的インポートのURL型定義
declare module '*?url' {
  const url: string
  export default url
}
