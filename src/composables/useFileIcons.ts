/**
 * File Icons for CodeLiner Web Code Editor
 * 
 * This implementation uses actual SVG files from the Material Icon Theme for VS Code.
 * Original Material Icon Theme:
 * - Repository: https://github.com/PKief/vscode-material-icon-theme
 * - Author: Philipp Kief
 * - License: MIT License
 */

export interface FileIcon {
  icon: string
  color: string
  type: 'svg' | 'emoji'
}

// アイコンファイル名とファイル拡張子のマッピング
const ICON_MAPPINGS: Record<string, string> = {
  'js': 'javascript',
  'jsx': 'react',
  'ts': 'typescript',
  'tsx': 'react_ts',
  'vue': 'vue',
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'sass',
  'sass': 'sass',
  'less': 'less',
  'py': 'python',
  'json': 'json',
  'jsonc': 'json',
  'md': 'markdown',
  'mdx': 'mdx',
  'yml': 'yaml',
  'yaml': 'yaml',
  'toml': 'toml',
  'xml': 'xml',
  'svg': 'svg',
  'php': 'php',
  'java': 'java',
  'kt': 'kotlin',
  'swift': 'swift',
  'go': 'go',
  'rs': 'rust',
  'rb': 'ruby',
  'c': 'c',
  'cpp': 'cpp',
  'h': 'h',
  'hpp': 'hpp',
  'cs': 'csharp',
  'sh': 'console',
  'bash': 'console',
  'ps1': 'powershell',
  'sql': 'database',
  'dockerfile': 'docker',
  'txt': 'document',
  'pdf': 'pdf',
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'gif': 'image',
  'webp': 'image',
  'ico': 'image',
  'mp4': 'video',
  'avi': 'video',
  'mp3': 'audio',
  'wav': 'audio',
  'zip': 'zip',
  'tar': 'zip',
  'gz': 'zip'
}

// 特殊ファイル名のマッピング
const SPECIAL_FILES: Record<string, string> = {
  'package.json': 'nodejs',
  'package-lock.json': 'npm',
  'yarn.lock': 'yarn',
  'composer.json': 'php',
  'cargo.toml': 'rust',
  'go.mod': 'go-mod',
  'requirements.txt': 'python',
  'dockerfile': 'docker',
  'docker-compose.yml': 'docker',
  'makefile': 'makefile',
  'tsconfig.json': 'tsconfig',
  'jsconfig.json': 'jsconfig',
  'webpack.config.js': 'webpack',
  'vite.config.js': 'vite',
  'vite.config.ts': 'vite',
  'readme.md': 'readme',
  'readme': 'readme',
  'license': 'lib',
  'changelog.md': 'changelog',
  '.gitignore': 'git',
  '.env': 'settings',
  '.eslintrc.js': 'eslint',
  '.prettierrc': 'prettier',
  'next.config.js': 'next',
  'vue.config.js': 'vue-config',
  'tailwind.config.js': 'tailwindcss'
}

// Material Icon Themeの色マッピング
const ICON_COLORS: Record<string, string> = {
  'javascript': '#f7df1e',
  'typescript': '#3178c6',
  'react': '#61dafb',
  'react_ts': '#61dafb',
  'vue': '#4fc08d',
  'html': '#e34f26',
  'css': '#1572b6',
  'sass': '#cf649a',
  'less': '#1d365d',
  'python': '#3776ab',
  'json': '#ffd700',
  'markdown': '#083fa1',
  'yaml': '#fbc02d',
  'php': '#777bb4',
  'java': '#ed8b00',
  'kotlin': '#7f52ff',
  'swift': '#fa7343',
  'go': '#00add8',
  'rust': '#dea584',
  'ruby': '#cc342d',
  'c': '#a8b9cc',
  'cpp': '#00599c',
  'csharp': '#239120',
  'nodejs': '#8cc84b',
  'npm': '#cb3837',
  'yarn': '#2c8ebb',
  'docker': '#2496ed',
  'git': '#f14e32'
}

// SVGアイコンファイルのパスを生成
const getIconPath = (iconName: string): string => {
  try {
    // Viteの動的インポートでSVGファイルを参照
    return new URL(`../assets/icons/${iconName}.svg`, import.meta.url).href
  } catch (error) {
    console.warn(`Icon not found: ${iconName}.svg`)
    // フォールバック: デフォルトファイルアイコン
    return new URL('../assets/icons/document.svg', import.meta.url).href
  }
}

export function useFileIcons() {
  const getFileIcon = (fileName: string, isDirectory: boolean = false): FileIcon => {
    if (isDirectory) {
      return {
        icon: getIconPath('folder-src'),
        color: ICON_COLORS['folder'] || '#fbbf24',
        type: 'svg'
      }
    }
    
    // 特殊ファイル名をチェック
    const lowerFileName = fileName.toLowerCase()
    if (SPECIAL_FILES[lowerFileName]) {
      const iconName = SPECIAL_FILES[lowerFileName]
      return {
        icon: getIconPath(iconName),
        color: ICON_COLORS[iconName] || '#6b7280',
        type: 'svg'
      }
    }
    
    // ファイル拡張子からアイコンを取得
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension && ICON_MAPPINGS[extension]) {
      const iconName = ICON_MAPPINGS[extension]
      return {
        icon: getIconPath(iconName),
        color: ICON_COLORS[iconName] || '#6b7280',
        type: 'svg'
      }
    }
    
    // デフォルトファイルアイコン
    return {
      icon: getIconPath('document'),
      color: '#6b7280',
      type: 'svg'
    }
  }
  
  const getLanguageFromExtension = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'vue': 'vue', 'html': 'html', 'htm': 'html', 'css': 'css', 'scss': 'scss',
      'py': 'python', 'json': 'json', 'md': 'markdown'
    }
    return languageMap[extension || ''] || 'plaintext'
  }
  
  return { getFileIcon, getLanguageFromExtension }
}