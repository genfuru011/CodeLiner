/**
 * File Icons for CodeLiner Web Code Editor
 * Based on Material Icon Theme
 * 
 * This provides file icons using SVG assets with beautiful Neovim-inspired theming
 */

export interface FileIcon {
  icon: string
  color: string
}

// アイコンマッピング（ファイル拡張子 -> アイコン）
const ICON_MAPPINGS: Record<string, FileIcon> = {
  // Web Technologies
  'html': { icon: '/src/assets/icons/html.svg', color: '#e34c26' },
  'htm': { icon: '/src/assets/icons/html.svg', color: '#e34c26' },
  'css': { icon: '/src/assets/icons/css.svg', color: '#1572b6' },
  'scss': { icon: '/src/assets/icons/sass.svg', color: '#cc6699' },
  'sass': { icon: '/src/assets/icons/sass.svg', color: '#cc6699' },
  'less': { icon: '/src/assets/icons/less.svg', color: '#1d365d' },
  'js': { icon: '/src/assets/icons/javascript.svg', color: '#f7df1e' },
  'jsx': { icon: '/src/assets/icons/react.svg', color: '#61dafb' },
  'ts': { icon: '/src/assets/icons/typescript.svg', color: '#3178c6' },
  'tsx': { icon: '/src/assets/icons/react_ts.svg', color: '#61dafb' },
  'vue': { icon: '/src/assets/icons/vue.svg', color: '#4fc08d' },
  
  // Programming Languages
  'py': { icon: '/src/assets/icons/python.svg', color: '#3776ab' },
  'java': { icon: '/src/assets/icons/java.svg', color: '#007396' },
  'c': { icon: '/src/assets/icons/c.svg', color: '#a8b9cc' },
  'cpp': { icon: '/src/assets/icons/cpp.svg', color: '#00599c' },
  'cs': { icon: '/src/assets/icons/csharp.svg', color: '#239120' },
  'php': { icon: '/src/assets/icons/php.svg', color: '#777bb4' },
  'rb': { icon: '/src/assets/icons/ruby.svg', color: '#cc342d' },
  'go': { icon: '/src/assets/icons/go.svg', color: '#00add8' },
  'rs': { icon: '/src/assets/icons/rust.svg', color: '#dea584' },
  'swift': { icon: '/src/assets/icons/swift.svg', color: '#fa7343' },
  'kt': { icon: '/src/assets/icons/kotlin.svg', color: '#0095d5' },
  'dart': { icon: '/src/assets/icons/dart.svg', color: '#0175c2' },
  
  // Config & Data
  'json': { icon: '/src/assets/icons/json.svg', color: '#ffd700' },
  'xml': { icon: '/src/assets/icons/xml.svg', color: '#ff6600' },
  'yaml': { icon: '/src/assets/icons/yaml.svg', color: '#cb171e' },
  'yml': { icon: '/src/assets/icons/yaml.svg', color: '#cb171e' },
  'toml': { icon: '/src/assets/icons/toml.svg', color: '#9c4221' },
  'sql': { icon: '/src/assets/icons/sql.svg', color: '#336791' },
  
  // Documentation
  'md': { icon: '/src/assets/icons/markdown.svg', color: '#083fa1' },
  'mdx': { icon: '/src/assets/icons/mdx.svg', color: '#1f2937' },
  'txt': { icon: '/src/assets/icons/text.svg', color: '#6b7280' },
  'pdf': { icon: '/src/assets/icons/pdf.svg', color: '#ff0000' },
  
  // Media
  'png': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'jpg': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'jpeg': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'gif': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'webp': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'ico': { icon: '/src/assets/icons/image.svg', color: '#10b981' },
  'svg': { icon: '/src/assets/icons/svg.svg', color: '#f59e0b' },
  'mp4': { icon: '/src/assets/icons/video.svg', color: '#7c3aed' },
  'avi': { icon: '/src/assets/icons/video.svg', color: '#7c3aed' },
  'mp3': { icon: '/src/assets/icons/audio.svg', color: '#059669' },
  'wav': { icon: '/src/assets/icons/audio.svg', color: '#059669' },
  
  // Archives
  'zip': { icon: '/src/assets/icons/archive.svg', color: '#8b5cf6' },
  'tar': { icon: '/src/assets/icons/archive.svg', color: '#8b5cf6' },
  'gz': { icon: '/src/assets/icons/archive.svg', color: '#8b5cf6' },
  
  // Shell
  'sh': { icon: '/src/assets/icons/shell.svg', color: '#4ade80' },
  'bash': { icon: '/src/assets/icons/shell.svg', color: '#4ade80' },
  'ps1': { icon: '/src/assets/icons/powershell.svg', color: '#0078d4' }
}

// 特殊ファイル名のマッピング  
const SPECIAL_FILES: Record<string, FileIcon> = {
  'package.json': { icon: '/src/assets/icons/nodejs.svg', color: '#8cc84b' },
  'package-lock.json': { icon: '/src/assets/icons/npm.svg', color: '#cb3837' },
  'yarn.lock': { icon: '/src/assets/icons/yarn.svg', color: '#2c8ebb' },
  'composer.json': { icon: '/src/assets/icons/php.svg', color: '#777bb4' },
  'cargo.toml': { icon: '/src/assets/icons/rust.svg', color: '#dea584' },
  'go.mod': { icon: '/src/assets/icons/go.svg', color: '#00add8' },
  'requirements.txt': { icon: '/src/assets/icons/python.svg', color: '#3776ab' },
  'dockerfile': { icon: '/src/assets/icons/docker.svg', color: '#2496ed' },
  'docker-compose.yml': { icon: '/src/assets/icons/docker.svg', color: '#2496ed' },
  'makefile': { icon: '/src/assets/icons/makefile.svg', color: '#427819' },
  'tsconfig.json': { icon: '/src/assets/icons/typescript.svg', color: '#3178c6' },
  'jsconfig.json': { icon: '/src/assets/icons/javascript.svg', color: '#f7df1e' },
  'webpack.config.js': { icon: '/src/assets/icons/webpack.svg', color: '#8dd6f9' },
  'vite.config.js': { icon: '/src/assets/icons/vite.svg', color: '#646cff' },
  'vite.config.ts': { icon: '/src/assets/icons/vite.svg', color: '#646cff' },
  'readme.md': { icon: '/src/assets/icons/readme.svg', color: '#0969da' },
  'readme': { icon: '/src/assets/icons/readme.svg', color: '#0969da' },
  'license': { icon: '/src/assets/icons/license.svg', color: '#6b7280' },
  'changelog.md': { icon: '/src/assets/icons/changelog.svg', color: '#059669' },
  '.gitignore': { icon: '/src/assets/icons/git.svg', color: '#f14e32' },
  '.env': { icon: '/src/assets/icons/settings.svg', color: '#fbbf24' },
  '.eslintrc.js': { icon: '/src/assets/icons/eslint.svg', color: '#4b32c3' },
  '.prettierrc': { icon: '/src/assets/icons/prettier.svg', color: '#ff7b7b' },
  'next.config.js': { icon: '/src/assets/icons/nextjs.svg', color: '#000000' },
  'vue.config.js': { icon: '/src/assets/icons/vue.svg', color: '#4fc08d' },
  'tailwind.config.js': { icon: '/src/assets/icons/tailwind.svg', color: '#38bdf8' }
}

// ディレクトリ名に基づくフォルダアイコンマッピング
const FOLDER_MAPPINGS: Record<string, FileIcon> = {
  // 開発関連
  'src': { icon: '/src/assets/icons/folder-src.svg', color: '#4fc08d' },
  'assets': { icon: '/src/assets/icons/folder-images.svg', color: '#10b981' },
  'components': { icon: '/src/assets/icons/folder-components.svg', color: '#61dafb' },
  'composables': { icon: '/src/assets/icons/folder-hook.svg', color: '#4fc08d' },
  'views': { icon: '/src/assets/icons/folder-views.svg', color: '#42b883' },
  'pages': { icon: '/src/assets/icons/folder-views.svg', color: '#42b883' },
  'utils': { icon: '/src/assets/icons/folder-utils.svg', color: '#fbbf24' },
  'helpers': { icon: '/src/assets/icons/folder-helper.svg', color: '#fbbf24' },
  'lib': { icon: '/src/assets/icons/folder-lib.svg', color: '#8b5cf6' },
  'libs': { icon: '/src/assets/icons/folder-lib.svg', color: '#8b5cf6' },
  'public': { icon: '/src/assets/icons/folder-public.svg', color: '#10b981' },
  'dist': { icon: '/src/assets/icons/folder-dist.svg', color: '#f59e0b' },
  'build': { icon: '/src/assets/icons/folder-dist.svg', color: '#f59e0b' },
  
  // ドキュメント関連
  'docs': { icon: '/src/assets/icons/folder-docs.svg', color: '#3b82f6' },
  'doc': { icon: '/src/assets/icons/folder-docs.svg', color: '#3b82f6' },
  'documentation': { icon: '/src/assets/icons/folder-docs.svg', color: '#3b82f6' },
  
  // テスト関連
  'test': { icon: '/src/assets/icons/folder-test.svg', color: '#ef4444' },
  'tests': { icon: '/src/assets/icons/folder-test.svg', color: '#ef4444' },
  '__tests__': { icon: '/src/assets/icons/folder-test.svg', color: '#ef4444' },
  'spec': { icon: '/src/assets/icons/folder-test.svg', color: '#ef4444' },
  'cypress': { icon: '/src/assets/icons/folder-cypress.svg', color: '#17202a' },
  
  // 設定関連
  'config': { icon: '/src/assets/icons/folder-config.svg', color: '#f59e0b' },
  'configs': { icon: '/src/assets/icons/folder-config.svg', color: '#f59e0b' },
  '.vscode': { icon: '/src/assets/icons/folder-vscode.svg', color: '#007acc' },
  '.github': { icon: '/src/assets/icons/folder-github.svg', color: '#24292e' },
  '.git': { icon: '/src/assets/icons/folder-git.svg', color: '#f14e32' },
  
  // フレームワーク・ライブラリ関連
  'node_modules': { icon: '/src/assets/icons/folder-node.svg', color: '#8cc84b' },
  'angular': { icon: '/src/assets/icons/folder-angular.svg', color: '#dd0031' },
  'react': { icon: '/src/assets/icons/folder-react-components.svg', color: '#61dafb' },
  'vue': { icon: '/src/assets/icons/folder-vue.svg', color: '#4fc08d' },
  'nuxt': { icon: '/src/assets/icons/folder-nuxt.svg', color: '#00c58e' },
  'next': { icon: '/src/assets/icons/folder-next.svg', color: '#000000' },
  
  // データベース・API関連
  'api': { icon: '/src/assets/icons/folder-api.svg', color: '#10b981' },
  'database': { icon: '/src/assets/icons/folder-database.svg', color: '#3b82f6' },
  'db': { icon: '/src/assets/icons/folder-database.svg', color: '#3b82f6' },
  'models': { icon: '/src/assets/icons/folder-database.svg', color: '#3b82f6' },
  'controllers': { icon: '/src/assets/icons/folder-controller.svg', color: '#f59e0b' },
  'routes': { icon: '/src/assets/icons/folder-routes.svg', color: '#8b5cf6' },
  'middleware': { icon: '/src/assets/icons/folder-middleware.svg', color: '#6b7280' },
  
  // スタイル関連
  'styles': { icon: '/src/assets/icons/folder-css.svg', color: '#1572b6' },
  'css': { icon: '/src/assets/icons/folder-css.svg', color: '#1572b6' },
  'scss': { icon: '/src/assets/icons/folder-sass.svg', color: '#cc6699' },
  'sass': { icon: '/src/assets/icons/folder-sass.svg', color: '#cc6699' },
  'less': { icon: '/src/assets/icons/folder-less.svg', color: '#1d365d' },
  
  // その他
  'images': { icon: '/src/assets/icons/folder-images.svg', color: '#10b981' },
  'img': { icon: '/src/assets/icons/folder-images.svg', color: '#10b981' },
  'fonts': { icon: '/src/assets/icons/folder-font.svg', color: '#6b7280' },
  'icons': { icon: '/src/assets/icons/folder-images.svg', color: '#f59e0b' },
  'scripts': { icon: '/src/assets/icons/folder-scripts.svg', color: '#4ade80' },
  'tools': { icon: '/src/assets/icons/folder-tools.svg', color: '#6b7280' },
  'deploy': { icon: '/src/assets/icons/folder-upload.svg', color: '#10b981' },
  'deployment': { icon: '/src/assets/icons/folder-upload.svg', color: '#10b981' },
  'docker': { icon: '/src/assets/icons/folder-docker.svg', color: '#2496ed' },
  'temp': { icon: '/src/assets/icons/folder-temp.svg', color: '#6b7280' },
  'tmp': { icon: '/src/assets/icons/folder-temp.svg', color: '#6b7280' },
  'backup': { icon: '/src/assets/icons/folder-backup.svg', color: '#6b7280' },
  'archive': { icon: '/src/assets/icons/folder-archive.svg', color: '#8b5cf6' }
}

export function useFileIcons() {
  const getFileIcon = (fileName: string, isDirectory: boolean = false): FileIcon => {
    if (isDirectory) {
      // ディレクトリ名に基づく特別なアイコンをチェック
      // スラッシュを除去して正規化
      const normalizedName = fileName.replace(/\/$/, '').toLowerCase()
      if (FOLDER_MAPPINGS[normalizedName]) {
        return FOLDER_MAPPINGS[normalizedName]
      }
      
      // デフォルトフォルダアイコン
      return {
        icon: '/src/assets/icons/folder.svg',
        color: '#94a3b8'
      }
    }
    
    // 特殊ファイル名をチェック
    const lowerFileName = fileName.toLowerCase()
    if (SPECIAL_FILES[lowerFileName]) {
      return SPECIAL_FILES[lowerFileName]
    }
    
    // ファイル拡張子からアイコンを取得
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension && ICON_MAPPINGS[extension]) {
      return ICON_MAPPINGS[extension]
    }
    
    // デフォルトファイルアイコン
    return {
      icon: '/src/assets/icons/file.svg',
      color: '#6b7280'
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