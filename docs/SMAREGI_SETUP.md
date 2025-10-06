# スマレジ連携セットアップガイド

## 概要
このシステムはスマレジAPIと連携して、商品管理・在庫管理・売上管理を統合的に行うことができます。

## 必要な情報

### 1. スマレジAPI認証情報
- **Contract ID**: スマレジの契約ID
- **Access Token**: スマレジAPIアクセストークン

### 2. API仕様
- **Base URL**: `https://api.smaregi.jp/v1`
- **認証方式**: Bearer Token + Contract ID Header

## セットアップ手順

### 1. スマレジ管理画面での設定
1. スマレジ管理画面にログイン
2. 「設定」→「API設定」を開く
3. 新しいAPIアプリケーションを作成
4. Contract IDとAccess Tokenを取得

### 2. 環境変数設定
`.env.local` ファイルに以下を追加：

```bash
SMAREGI_CONTRACT_ID="your-contract-id"
SMAREGI_ACCESS_TOKEN="your-access-token"
SMAREGI_BASE_URL="https://api.smaregi.jp/v1"
```

### 3. システム設定
1. 管理画面にログイン: http://localhost:3001/admin
2. 「スマレジ連携」メニューを選択
3. Contract IDとAccess Tokenを入力
4. 「設定更新」ボタンをクリック
5. 接続状態が「接続中」になることを確認

## 利用可能な機能

### 商品管理
- ✅ 商品情報取得
- ✅ 商品登録
- ✅ 商品更新
- ✅ 商品削除

### 在庫管理
- ✅ 在庫情報取得
- ✅ 在庫数更新

### 売上管理
- ✅ 取引情報取得
- ✅ 売上登録

### 顧客管理
- ✅ 顧客情報取得

## API エンドポイント

### 接続確認
- `GET /api/smaregi/health` - 接続状態確認
- `PUT /api/smaregi/health` - 設定更新

### 商品管理
- `GET /api/smaregi/products` - 商品一覧取得
- `POST /api/smaregi/products` - 商品作成
- `PUT /api/smaregi/products/[id]` - 商品更新
- `DELETE /api/smaregi/products/[id]` - 商品削除

### 在庫管理
- `GET /api/smaregi/stocks` - 在庫情報取得
- `PUT /api/smaregi/stocks` - 在庫更新

### 売上管理
- `GET /api/smaregi/transactions` - 取引履歴取得
- `POST /api/smaregi/transactions` - 売上登録

## 使用例

### JavaScript/TypeScript
```typescript
// 商品情報取得
const response = await fetch('/api/smaregi/products?limit=10')
const result = await response.json()

if (result.success) {
  console.log('商品一覧:', result.data)
} else {
  console.error('エラー:', result.error)
}

// 売上登録
const transaction = {
  items: [
    {
      productId: "12345",
      quantity: 2,
      unitPrice: 1000
    }
  ],
  paymentMethod: 'cash'
}

const response = await fetch('/api/smaregi/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(transaction),
})
```

## トラブルシューティング

### 接続エラー
1. Contract IDとAccess Tokenが正しいか確認
2. スマレジ側でAPIアプリケーションが有効か確認
3. ネットワーク接続を確認

### 認証エラー
1. Access Tokenの有効期限を確認
2. Contract IDが正しいか確認
3. スマレジ側の権限設定を確認

### データ同期エラー
1. データ形式が正しいか確認
2. 必須フィールドが全て含まれているか確認
3. スマレジ側のデータ制限を確認

## セキュリティ注意事項

1. **Access Tokenの管理**
   - 環境変数で管理し、コードに直接記述しない
   - 定期的にトークンを更新する
   - 開発・本番環境で異なるトークンを使用

2. **通信の暗号化**
   - 必ずHTTPS通信を使用
   - 機密データの暗号化を検討

3. **ログ管理**
   - API呼び出しログを記録
   - エラー発生時の詳細ログを保持
   - 定期的なログの監視

## サポート

問題が発生した場合は、以下を確認してください：
1. スマレジAPI公式ドキュメント
2. システムログ（/api/smaregi/* のエラーログ）
3. ネットワーク接続状況