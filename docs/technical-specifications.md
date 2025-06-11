# CodeLiner Technical Specifications

## Architecture Overview

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Layer                          │
├─────────────────────────────────────────────────────────────┤
│                    Vue.js 3 Application                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Components    │  │   Composables   │  │    Assets    │ │
│  │                 │  │                 │  │              │ │
│  │ • FileIcon      │  │ • useFileIcons  │  │ • SVG Icons  │ │
│  │ • MonacoEditor  │  │ • useSettings   │  │ • Themes     │ │
│  │ • Sidebar       │  │ • useStatusBar  │  │ • Fonts      │ │
│  │ • StatusBar     │  │ • useResponsive │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Monaco Editor Engine                    │
├─────────────────────────────────────────────────────────────┤
│                       Build Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │      Vite       │  │   TypeScript    │  │ Tailwind CSS │ │
│  │   Build Tool    │  │   Compiler      │  │  Framework   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. FileIcon.vue
**Purpose**: Display SVG-based file and folder icons  
**Type**: Presentation Component  

```typescript
interface Props {
  fileName: string
  isDirectory?: boolean
  size?: 'sm' | 'md' | 'lg'
}

interface FileIcon {
  icon: string  // SVG file path
  color: string // Hex color code
}
```

**Features**:
- SVG-based icon rendering
- Dynamic color application
- Language-specific icons
- Folder type recognition
- Responsive sizing

### 2. MonacoEditor.vue
**Purpose**: Code editing interface  
**Type**: Complex Component  

```typescript
interface Props {
  modelValue: string
  language: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

interface Emits {
  'update:modelValue': (value: string) => void
  'editor-ready': (editor: monaco.editor.IStandaloneCodeEditor) => void
}
```

**Features**:
- Monaco Editor integration
- TypeScript/JavaScript support
- Syntax highlighting
- Auto-completion
- Error detection
- Keyboard shortcuts

### 3. NeovimSidebar.vue
**Purpose**: File explorer and project navigation  
**Type**: Complex Component  
**Status**: UI Complete, File System Integration Pending

```typescript
interface FileTreeItem {
  name: string
  path: string
  type: 'file' | 'directory'
  depth: number
  expanded?: boolean
  gitStatus?: 'modified' | 'added' | 'deleted' | 'untracked'
  children?: FileTreeItem[]
}

interface Emits {
  'toggle': []
  'file-select': [path: string]
  'folder-toggle': [path: string]  // UI implemented, logic pending
  'new-file': []                   // UI implemented, logic pending
  'new-folder': []                 // UI implemented, logic pending
  'refresh': []                    // UI implemented, logic pending
}
```

**Features**:
- ✅ Tree structure display
- ⚠️ Folder expand/collapse (UI only)
- ⚠️ File operations (buttons only)
- ✅ Icon integration
- ⚠️ Git status display (UI only)
- ⚠️ Context menu (planned)

### 4. NeovimStatusBar.vue
**Purpose**: Display editor status information in Neovim style  
**Type**: Information Component  
**Status**: Fully Implemented

```typescript
interface Props {
  currentMode?: 'normal' | 'insert' | 'visual' | 'command'
  fileName?: string
  isModified?: boolean
  isReadonly?: boolean
  gitBranch?: string        // UI implemented, Git integration pending
  gitChanges?: string       // UI implemented, Git integration pending
  encoding?: string
  fileType?: string
  line?: number
  column?: number
  totalLines?: number
}
```

**Features**:
- ✅ Neovim-style mode indicator
- ✅ Real-time cursor position
- ✅ File information display
- ✅ Progress percentage
- ⚠️ Git status (UI only)
- ✅ Encoding display

### 5. SettingsModal.vue
**Purpose**: Application configuration interface  
**Type**: Modal Component  

```typescript
interface Settings {
  theme: 'dark' | 'light'
  fontSize: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
}
```

**Features**:
- Emoji-based navigation
- Neovim-style design
- Real-time preview
- Persistent settings

## Composables Specifications

### 1. useFileIcons.ts
**Purpose**: File icon logic and mapping  

```typescript
// Core Functions
function getFileIcon(fileName: string, isDirectory: boolean): FileIcon
function getLanguageFromExtension(fileName: string): string

// Icon Mappings
const ICON_MAPPINGS: Record<string, FileIcon>      // File extensions
const SPECIAL_FILES: Record<string, FileIcon>     // Special filenames
const FOLDER_MAPPINGS: Record<string, FileIcon>   // Directory types
```

**Supported File Types**:
- **Web**: html, css, js, ts, vue, react
- **Languages**: python, java, c, cpp, go, rust
- **Config**: json, yaml, xml, toml
- **Media**: png, jpg, svg, mp4, mp3
- **Special**: README, package.json, .gitignore

**Folder Categories**:
- **Development**: src, components, utils, lib
- **Documentation**: docs, documentation
- **Testing**: test, tests, spec
- **Configuration**: config, .vscode, .github
- **Framework**: node_modules, react, vue

### 2. useSettings.ts
**Purpose**: Application settings management  

```typescript
interface AppSettings {
  editor: {
    theme: string
    fontSize: number
    tabSize: number
    wordWrap: boolean
    minimap: boolean
  }
  ui: {
    sidebarWidth: number
    showStatusBar: boolean
    darkMode: boolean
  }
}

// Core Functions
function loadSettings(): AppSettings
function saveSettings(settings: AppSettings): void
function resetToDefaults(): void
```

### 3. useStatusBar.ts
**Purpose**: Status bar state management  

```typescript
interface StatusBarState {
  currentLanguage: string
  cursorPosition: { line: number; column: number }
  fileInfo: { name: string; size: string }
  isModified: boolean
}

// Reactive State
const statusBarState = reactive<StatusBarState>({...})

// Update Functions
function updateLanguage(language: string): void
function updateCursorPosition(line: number, column: number): void
function updateFileInfo(name: string, content: string): void
```

### 4. useResponsive.ts
**Purpose**: Responsive design utilities  

```typescript
// Breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

// Reactive Properties
const isMobile = computed(() => windowWidth.value < breakpoints.md)
const isTablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)
```

## Icon System Architecture

### SVG Icon Structure
```
src/assets/icons/
├── languages/          # Programming language icons
│   ├── javascript.svg
│   ├── typescript.svg
│   ├── python.svg
│   └── ...
├── folders/           # Folder type icons
│   ├── folder-src.svg
│   ├── folder-docs.svg
│   ├── folder-test.svg
│   └── ...
├── frameworks/        # Framework-specific icons
│   ├── vue.svg
│   ├── react.svg
│   ├── angular.svg
│   └── ...
└── special/          # Special file icons
    ├── readme.svg
    ├── license.svg
    ├── git.svg
    └── ...
```

### Icon Naming Convention
```
# Language icons
{language}.svg          # e.g., javascript.svg, python.svg

# Folder icons
folder-{type}.svg       # e.g., folder-src.svg, folder-docs.svg

# Framework icons
{framework}.svg         # e.g., vue.svg, react.svg

# Special files
{purpose}.svg          # e.g., readme.svg, license.svg
```

### Color Mapping Strategy
```typescript
// Color Categories
const colorMap = {
  // Primary languages
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  
  // Folder types
  documentation: '#3b82f6',  // Blue
  development: '#10b981',    // Green
  testing: '#ef4444',        // Red
  configuration: '#f59e0b',  // Orange
  
  // Frameworks
  vue: '#4fc08d',
  react: '#61dafb',
  angular: '#dd0031'
}
```

## Build and Development Specifications

### Vite Configuration
```typescript
export default defineConfig({
  plugins: [vue(), dts()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['monaco-editor/esm/vs/editor/editor.worker']
    }
  }
})
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

### Tailwind CSS v4 Configuration
```javascript
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1b23',
          surface: '#2a2b35',
          border: '#3a3b47'
        }
      }
    }
  }
}
```

## Performance Optimizations

### Code Splitting
- Dynamic imports for large components
- Monaco Editor lazy loading
- Icon lazy loading

### Bundle Optimization
- Tree shaking enabled
- Unused CSS removal
- Asset optimization

### Memory Management
- Component lifecycle cleanup
- Event listener removal
- Monaco Editor disposal

## Testing Strategy

### Unit Testing (Planned)
```typescript
// Component testing with Vue Test Utils
describe('FileIcon.vue', () => {
  test('displays correct icon for JavaScript files', () => {
    // Test implementation
  })
})

// Composables testing
describe('useFileIcons', () => {
  test('returns correct icon for file extension', () => {
    // Test implementation
  })
})
```

### Integration Testing (Planned)
- Monaco Editor integration
- File system operations
- Component interactions

### E2E Testing (Planned)
- User workflows
- Cross-browser compatibility
- Performance benchmarks

## Security Considerations

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-eval';  // Monaco Editor requirement
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
```

### Input Sanitization
- Code execution sandboxing
- File name validation
- XSS prevention

## Deployment Specifications

### Static Build
```bash
npm run build
# Outputs to dist/ directory
# Ready for static hosting
```

### Environment Variables
```env
VITE_APP_TITLE=CodeLiner
VITE_API_BASE_URL=http://localhost:3000  # Future backend
VITE_ENVIRONMENT=production
```

### Hosting Requirements
- Static file hosting (Netlify, Vercel, GitHub Pages)
- HTTPS required for Web Workers
- Modern browser support (ES2020+)

## Future Backend Specifications (Planned)

### Rails 8 API
```ruby
# API endpoints structure
GET    /api/projects          # List projects
POST   /api/projects          # Create project
GET    /api/projects/:id      # Get project
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project

GET    /api/projects/:id/files     # List files
POST   /api/projects/:id/files     # Create file
GET    /api/files/:id              # Get file content
PUT    /api/files/:id              # Update file
DELETE /api/files/:id              # Delete file
```

### WebSocket Integration (Planned)
```typescript
// Real-time collaboration
interface CollaborationEvent {
  type: 'cursor-move' | 'text-change' | 'file-change'
  userId: string
  data: any
}
```

---

*Document Version: 1.0*  
*Last Updated: 2025-06-11*  
*Status: Complete for current version*
