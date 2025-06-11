# CodeLiner 

> 軽量でシンプルなWebコードエディタ - Neovimインスパイアドなモダンデザイン

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-VS%20Code%20Engine-007ACC?style=flat-square&logo=visual-studio-code)](https://microsoft.github.io/monaco-editor/)

## 概要

CodeLinerは、**Neovim**と**HackMD**からインスピレーションを得たモダンデザインを採用した軽量・シンプルなWebコードエディタです。VS Codeと同じMonaco Editorエンジンを搭載し、美しいファイルアイコンシステムと直感的なUIで、高速で快適な開発体験を提供します。

## 特徴

- **Neovim インスパイアドデザイン** - ダークテーマと開発者フレンドリーなUI
- **軽量・高速** - Vue.js 3 + Vite による瞬時の起動と高速HMR
- **Monaco Editor搭載** - VS Codeと同じエディタエンジンによる高機能編集
- **学習容易** - シンプルな技術スタックで簡単に理解・拡張可能
- ⌨️ **キーボードショートカット** - Ctrl+S (保存), Ctrl+Enter (実行)
- **美しいダークテーマ** - 目に優しく長時間作業に最適
- **Material Icon Theme** - 60+のSVGアイコンによる視覚的ファイル管理
- **完全レスポンシブ** - デスクトップ・タブレット・モバイル対応

## 技術スタック

### Frontend
- **Vue.js 3** (Composition API) - Progressive JavaScript Framework
- **TypeScript** - 型安全性とコード品質向上
- **Vite** - 次世代高速ビルドツール
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **Monaco Editor** - VS Codeエディタエンジン
- **Headless UI** - アクセシブルなUIコンポーネント

### 開発ツール
- **ESLint** - コード品質チェック
- **Prettier** - 一貫したコードフォーマット
- **PostCSS** - 先進的CSS処理
- **TypeScript Compiler** - 静的型チェック

### 予定している Backend
- **Rails 8 API mode** - 軽量で高速なAPI開発

## セットアップ

### 必要環境
- Node.js (v18以上)
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-username/codeliner.git
cd codeliner

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview

# 型チェック
npm run type-check
```

## 機能

### 実装済み機能
- **Monaco Editor統合** - VS Codeと同じエディタエンジンによる高機能編集
- **JavaScript実行** - リアルタイムコード実行とコンソール出力
- **Material Icon Theme** - 60+言語・フレームワーク対応のSVGアイコン
- **Neovimテーマ** - 開発者向けの美しいダークテーマ
- **ファイルエクスプローラーUI** - ツリー構造による視覚的ナビゲーション
- **Neovimスタイルステータスバー** - モード表示、カーソル位置、ファイル情報
- **設定モーダル** - 絵文字ナビゲーション付きのユーザー設定
- **キーボードショートカット** - 効率的な操作
- **完全レスポンシブ** - 全デバイス対応

### UI実装済み・機能実装中
- **ファイル作成/削除** - ボタンUI実装済み、実際の操作機能は開発中
- **フォルダ展開/折りたたみ** - UI実装済み、ファイルシステム接続は開発中
- **Git状態表示** - ステータス表示UI実装済み、実際のGit統合は開発中
- **コマンドライン** - UI実装済み、コマンド実行機能は開発中

### 開発中の機能
- 複数ファイル同時編集
- ファイル保存/読み込み機能
- プロジェクト管理システム

### 今後の機能予定
#### Phase 0: UI機能化（最優先）
- [ ] ファイル作成/削除機能の実装（UIは実装済み）
- [ ] フォルダ展開/折りたたみ機能の実装（UIは実装済み）
- [ ] 実際のファイルシステム接続
- [ ] コマンドライン機能の実装（UIは実装済み）

#### Phase 1: 基本機能完成
- [ ] ファイル永続化機能
- [ ] マルチタブエディタ
- [ ] プロジェクトフォルダ管理
- [ ] ファイル操作（リネーム、移動、削除）

#### Phase 2: 言語サポート拡張
- [ ] Python実行環境
- [ ] HTML/CSS ライブプレビュー
- [ ] Markdown プレビュー機能
- [ ] その他言語サポート（Go, Rust, etc.）

#### Phase 3: バックエンド連携
- [ ] Rails 8 API サーバー構築
- [ ] ユーザー認証システム
- [ ] プロジェクト共有機能
- [ ] リアルタイム協調編集

#### Phase 4: 高度な機能
- [ ] Git統合機能
- [ ] デバッガー機能
- [ ] 拡張機能システム
- [ ] カスタムテーマ作成

## デザインシステム

### Neovimインスパイアド カラーパレット
```css
/* 背景色 */
--bg-primary: #1a1b23;          /* メイン背景 */
--bg-secondary: #2a2b35;        /* サーフェス */
--bg-tertiary: #343644;         /* ホバー状態 */

/* テキスト色 */
--text-primary: #e4e6ea;        /* メインテキスト */
--text-secondary: #a8abb2;      /* 薄いテキスト */
--text-muted: #6b7280;          /* ミュートテキスト */

/* アクセントカラー */
--accent-blue: #3b82f6;         /* ドキュメント */
--accent-green: #10b981;        /* 開発ファイル */
--accent-yellow: #fbbf24;       /* ユーティリティ */
--accent-purple: #8b5cf6;       /* ライブラリ */
--accent-red: #ef4444;          /* テスト */
```

### ファイルアイコンシステム
CodeLinerは、**Material Icon Theme**からインスピレーションを得た包括的なアイコンシステムを搭載：

- **60+言語対応** - JavaScript, TypeScript, Python, Go, Rust等
- **フレームワーク認識** - Vue, React, Angular, Next.js等
- **フォルダタイプ別** - src, docs, test, config等の用途別アイコン
- **特殊ファイル** - package.json, README.md, .gitignore等

## プロジェクト構造

```
src/
├── components/              # Vueコンポーネント
│   ├── FileIcon.vue        # SVGアイコン表示
│   ├── MonacoEditor.vue    # Monaco Editorラッパー
│   ├── NeovimSidebar.vue   # ファイルエクスプローラー
│   ├── NeovimStatusBar.vue # ステータス情報表示
│   ├── SettingsModal.vue   # 設定UI (絵文字ナビ)
│   └── CommandLine.vue     # コマンドライン機能
├── composables/            # Vue Composition API
│   ├── useFileIcons.ts     # ファイルアイコンロジック
│   ├── useSettings.ts      # アプリケーション設定
│   ├── useStatusBar.ts     # ステータスバー管理
│   └── useResponsive.ts    # レスポンシブ対応
├── assets/                 # 静的アセット
│   └── icons/             # 60+ SVGアイコン
├── workers/               # Web Workers
├── App.vue               # メインアプリケーション
├── main.ts              # エントリーポイント
└── style.css           # グローバルスタイル
```

## ドキュメント

詳細なドキュメントは`docs/`フォルダにあります：

- **[開発進捗レポート](docs/development-progress.md)** - プロジェクトの詳細な進捗状況
- **[技術仕様書](docs/technical-specifications.md)** - アーキテクチャと実装詳細
- **[プロジェクト設定](docs/project-config.yml)** - YAML形式の設定情報

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 謝辞

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Microsoft
- [Vue.js](https://vuejs.org/) - Vue.js Team  
- [Tailwind CSS](https://tailwindcss.com/) - Tailwind Labs
- [Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme) - Philipp Kief (ファイルアイコンシステム)
- [Neovim](https://neovim.io/) - Neovim Team (テーマインスピレーション)
- [HackMD](https://hackmd.io/) - HackMD Team (デザインインスピレーション)

詳細な帰属表示については [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md) をご覧ください。

---

## バージョン情報

**Current Version**: 0.1.0  
**Status**: Active Development  
**Last Updated**: 2025年6月11日

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/your-username/codeliner)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Vue.js](https://img.shields.io/badge/Built%20with-Vue.js%203-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
