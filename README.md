# CodeLiner 

> 軽量でシンプルなWebコードエディタ - HackMDライクなモダンデザイン

## 🚀 概要

CodeLinerは、HackMDのようなモダンデザインを採用した軽量・シンプルなWebコードエディタです。学習曲線が低く、高速な開発体験を提供します。

## ✨ 特徴

- 🎨 **HackMDライクなモダンデザイン** - ダークテーマとクリーンなUI
- ⚡ **軽量・高速** - Vue.js + Vite による高速な開発環境
- 🔧 **Monaco Editor** - VS Codeと同じエディタエンジンを搭載
- 🎯 **学習容易** - シンプルな技術スタックで簡単に理解・拡張可能
- ⌨️ **キーボードショートカット** - Ctrl+S (保存), Ctrl+Enter (実行)
- 🌙 **ダークテーマ** - 目に優しいカラーパレット

## 🛠️ 技術スタック

### Frontend
- **Vue.js 3** - Progressive JavaScript Framework
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **Monaco Editor** - VS Codeエディタエンジン
- **Headless UI** - アクセシブルなUIコンポーネント

### 予定している Backend
- **Rails 8 API mode** - 軽量なAPI開発

## 🚦 セットアップ

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

## 🎯 機能

### 現在の機能
- ✅ Monaco Editorによるコード編集
- ✅ JavaScript実行とコンソール出力
- ✅ ファイルエクスプローラー（UI）
- ✅ HackMDライクなダークテーマ
- ✅ キーボードショートカット

### 今後の機能予定
- 🔲 複数ファイル管理
- 🔲 異なる言語サポート (Python, HTML/CSS等)
- 🔲 リアルタイムプレビュー
- 🔲 ファイル保存/読み込み
- 🔲 テーマ切り替え
- 🔲 Rails APIバックエンド連携

## 🎨 デザインシステム

```css
/* カラーパレット */
--color-dark-bg: #1a1b23;          /* メイン背景 */
--color-dark-surface: #2a2b35;      /* サーフェス */
--color-dark-surface-hover: #343644; /* ホバー状態 */
--color-dark-border: #3a3b47;       /* ボーダー */
--color-dark-text: #e4e6ea;         /* メインテキスト */
--color-dark-text-muted: #a8abb2;   /* 薄いテキスト */
--color-accent: #4285f4;            /* アクセントカラー */
--color-accent-hover: #5a95f5;      /* アクセントホバー */
```

## 📁 プロジェクト構造

```
src/
├── components/          # Vueコンポーネント
│   ├── MonacoEditor.vue # Monaco Editorラッパー
│   └── ...
├── assets/             # 静的アセット
├── App.vue            # メインアプリケーション
├── main.ts            # エントリーポイント
├── userWorker.ts      # Monaco Editor Web Worker設定
└── style.css          # グローバルスタイル
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Microsoft
- [Vue.js](https://vuejs.org/) - Vue.js Team
- [Tailwind CSS](https://tailwindcss.com/) - Tailwind Labs
- [HackMD](https://hackmd.io/) - デザインインスピレーション
