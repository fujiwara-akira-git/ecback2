# 🛒 ECBack2 - E-Commerce Admin Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**完全な管理者専用システム** - E-Commerce店舗の包括的な管理システム

## 🎯 システム概要

ECBack2は、E-Commerce店舗運営に必要な全機能を網羅した管理者専用システムです。
販売管理から顧客管理、在庫管理まで、店舗運営に必要な全ての機能を統合管理できます。

## 🚀 主要機能

### 🔐 認証システム
- **管理者専用ログイン**: `userType=admin` のユーザーのみアクセス可能
- **全ユーザー管理**: 管理者・顧客両方のユーザーデータを管理
- **セッション管理**: localStorage ベースの認証システム

### 📋 10階層管理メニュー
1. **🛒 販売管理（POS）** - レジ・決済・売上管理
2. **👥 顧客管理** - 顧客情報・ポイント・セグメント分析
3. **📦 商品管理** - 商品・カテゴリ・価格・画像管理
4. **📋 注文管理** - 注文処理・配送・返品管理
5. **📊 在庫管理** - 在庫追跡・入出庫・発注管理
6. **🎯 マーケティング** - キャンペーン・クーポン・SNS連携
7. **📈 売上分析** - ダッシュボード・レポート・データ分析
8. **⚙️ システム設定** - 権限・決済・配送・セキュリティ設定
9. **[予約済み]** - 将来の機能拡張用
10. **🗄️ データベース管理** - 12テーブルの直接CRUD操作

## 🏗️ 技術スタック

- **Frontend**: Next.js 14.2.5 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM 5.22.0
- **Styling**: TailwindCSS 3.0
- **Authentication**: Custom localStorage-based system

## 📊 データベース構造

```sql
-- 12テーブル構成
User          -- ユーザー管理（管理者・顧客）
Product       -- 商品情報
Category      -- 商品カテゴリ
Order         -- 注文情報
OrderItem     -- 注文明細
CartItem      -- カート情報
Payment       -- 決済情報
Delivery      -- 配送情報
Inventory     -- 在庫管理
Producer      -- 生産者情報
FavoriteProducer -- お気に入り生産者
StripeEvent   -- Stripe決済イベント
```

## 🔧 セットアップ

### 1. リポジトリクローン
```bash
git clone https://github.com/fujiwara-akira-git/ecback2.git
cd ecback2
```

### 2. 依存関係インストール
```bash
npm install
```

### 3. データベース設定
```bash
# PostgreSQL データベース作成
createdb dev

# 環境変数設定 (.env.local)
DATABASE_URL="postgresql://dev:dev@localhost:5432/dev"

# Prisma設定
npx prisma generate
npx prisma db push
```

### 4. 管理者アカウント作成
```bash
node create-admin-direct.js
```

### 5. 開発サーバー起動
```bash
npm run dev
```

## 🔑 管理者ログイン

- **URL**: [http://localhost:3001/admin](http://localhost:3001/admin)
- **メールアドレス**: `admin@example.com`
- **パスワード**: `admin`

> ℹ️ **重要**: このシステムは `userType=admin` のユーザーのみログイン可能ですが、全ユーザー（管理者・顧客）を管理できます。

## 📱 システム特徴

### 🎨 表形式UI
- 全機能で統一された表形式表示
- 罫線付きテーブルデザイン
- レスポンシブ対応

### 📊 リアルタイム統計
- 各管理画面に関連統計を表示
- 売上・在庫・顧客データのダッシュボード
- 視覚的なデータ表現

### 🔄 階層ナビゲーション
- 10階層のメインメニュー
- 各階層に6-8個のサブ機能
- 直感的なナビゲーション

## 🛠️ 開発情報

### ディレクトリ構造
```
├── app/
│   ├── admin/          # 管理画面
│   │   ├── analytics/  # 売上分析
│   │   ├── customers/  # 顧客管理
│   │   ├── database/   # DB管理
│   │   ├── inventory/  # 在庫管理
│   │   ├── login/      # ログイン
│   │   ├── marketing/  # マーケティング
│   │   ├── orders/     # 注文管理
│   │   ├── pos/        # POS管理
│   │   ├── products/   # 商品管理
│   │   └── settings/   # システム設定
│   ├── api/            # API エンドポイント
│   └── globals.css     # グローバルスタイル
├── lib/                # ライブラリ
├── prisma/            # データベーススキーマ
└── README.md
```

### 主要コマンド
```bash
npm run dev     # 開発サーバー起動
npm run build   # プロダクションビルド
npm run start   # プロダクションサーバー起動
```

## 📈 今後の拡張予定

- [ ] リアルタイム在庫連携
- [ ] 高度な分析機能
- [ ] モバイルアプリ連携
- [ ] 外部サービス統合
- [ ] 多言語対応

## 📞 サポート

このシステムに関するお問い合わせは、GitHubのIssuesをご利用ください。

---

**🔒 重要**: このシステムは管理者専用です。適切なセキュリティ対策を講じて運用してください。
