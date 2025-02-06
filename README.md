# SubscruBuddy

このプロジェクトは、サブスクリプション管理アプリケーションです。

## 必要な環境

- Node.js (v18.0.0以上)
- npm または bun
- Git

## 環境構築手順

### 1. Node.jsのインストール

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS（推奨版）をダウンロード
3. インストーラーを実行し、指示に従ってインストール
4. インストール確認:
```bash
node -v
npm -v
```

### 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/subscrubuddy.git
cd subscrubuddy

# 依存関係のインストール
npm install
# または
bun install

# 開発サーバーの起動
npm run dev
# または
bun run dev
```

## Firebase設定

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力し、指示に従って作成

### 2. Firebaseの設定

1. プロジェクト設定から必要な環境変数を取得:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

2. `.env.local`ファイルを作成し、環境変数を設定:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Rulesの設定

1. Firebase Consoleで「Firestore Database」を選択
2. 「ルール」タブを選択
3. 以下のルールをコピー&ペースト:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Netlifyへのデプロイ方法

### 1. Netlifyの設定

1. [Netlify](https://www.netlify.com/)にアカウント作成・ログイン
2. 「New site from Git」をクリック
3. GitHubリポジトリを選択
4. ビルド設定:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2. 環境変数の設定

1. Site settings > Build & deploy > Environment
2. 「Edit variables」をクリック
3. Firebaseの環境変数を追加

### 3. デプロイ設定

1. Deploy settingsで以下を設定:
   - Base directory: `/`
   - Build command: `npm run build`
   - Publish directory: `dist`
2. 「Deploy site」をクリック

## 開発の始め方

1. 開発サーバーの起動:
```bash
npm run dev
```

2. ブラウザで `http://localhost:5173` にアクセス

## トラブルシューティング

### よくある問題と解決方法

1. `npm install`でエラーが発生する場合:
   - Node.jsのバージョンを確認
   - npm cacheのクリア: `npm cache clean --force`

2. 開発サーバーが起動しない場合:
   - ポート5173が使用可能か確認
   - プロジェクトを再クローン

## サポート

質問や問題がある場合は、GitHubのIssuesに投稿してください。
