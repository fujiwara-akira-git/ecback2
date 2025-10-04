'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DatabaseManagement() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // ログイン中の管理者情報を取得
    const adminUser = localStorage.getItem('adminUser')
    const adminSession = localStorage.getItem('adminSession')
    
    if (!adminUser || !adminSession) {
      window.location.replace('/admin/login')
      return
    }
    
    if (adminUser) {
      const user = JSON.parse(adminUser)
      setCurrentAdmin(user)
    }
  }, [])

  // データベーステーブル管理メニュー
  const databaseTables = [
    {
      name: 'User',
      displayName: 'ユーザー管理',
      description: '管理者・顧客アカウント管理',
      icon: '👥',
      route: '/admin/database/users',
      color: 'bg-blue-500 hover:bg-blue-600',
      recordCount: '24件'
    },
    {
      name: 'Product',
      displayName: '商品管理',
      description: '商品情報・価格・説明',
      icon: '📦',
      route: '/admin/database/products',
      color: 'bg-green-500 hover:bg-green-600',
      recordCount: '取得中...'
    },
    {
      name: 'Category',
      displayName: 'カテゴリ管理',
      description: '商品カテゴリ・分類',
      icon: '📂',
      route: '/admin/database/categories',
      color: 'bg-purple-500 hover:bg-purple-600',
      recordCount: '取得中...'
    },
    {
      name: 'Order',
      displayName: '注文管理',
      description: '注文履歴・ステータス',
      icon: '📋',
      route: '/admin/database/orders',
      color: 'bg-orange-500 hover:bg-orange-600',
      recordCount: '取得中...'
    },
    {
      name: 'OrderItem',
      displayName: '注文明細管理',
      description: '注文商品詳細',
      icon: '📝',
      route: '/admin/database/order-items',
      color: 'bg-teal-500 hover:bg-teal-600',
      recordCount: '取得中...'
    },
    {
      name: 'CartItem',
      displayName: 'カート管理',
      description: 'ショッピングカート',
      icon: '🛒',
      route: '/admin/database/cart-items',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      recordCount: '取得中...'
    },
    {
      name: 'Payment',
      displayName: '決済管理',
      description: '決済情報・履歴',
      icon: '💳',
      route: '/admin/database/payments',
      color: 'bg-pink-500 hover:bg-pink-600',
      recordCount: '取得中...'
    },
    {
      name: 'Delivery',
      displayName: '配送管理',
      description: '配送状況・住所',
      icon: '🚚',
      route: '/admin/database/deliveries',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      recordCount: '取得中...'
    },
    {
      name: 'Inventory',
      displayName: '在庫管理',
      description: '在庫数・入出荷',
      icon: '📊',
      route: '/admin/database/inventory',
      color: 'bg-red-500 hover:bg-red-600',
      recordCount: '取得中...'
    },
    {
      name: 'Producer',
      displayName: '生産者管理',
      description: '生産者情報・プロフィール',
      icon: '👨‍🌾',
      route: '/admin/database/producers',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      recordCount: '取得中...'
    },
    {
      name: 'FavoriteProducer',
      displayName: 'お気に入り生産者',
      description: '顧客の生産者お気に入り',
      icon: '⭐',
      route: '/admin/database/favorite-producers',
      color: 'bg-amber-500 hover:bg-amber-600',
      recordCount: '取得中...'
    },
    {
      name: 'StripeEvent',
      displayName: 'Stripe決済ログ',
      description: 'Stripe決済イベント',
      icon: '💰',
      route: '/admin/database/stripe-events',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      recordCount: '取得中...'
    }
  ]

  // システム管理メニュー
  const systemTools = [
    {
      name: 'backup',
      displayName: 'データベースバックアップ',
      description: '全テーブルのバックアップ作成',
      icon: '💾',
      route: '/admin/database/backup',
      color: 'bg-slate-600 hover:bg-slate-700'
    },
    {
      name: 'import',
      displayName: 'データインポート',
      description: 'CSV・JSON形式でデータ一括登録',
      icon: '📥',
      route: '/admin/database/import',
      color: 'bg-stone-600 hover:bg-stone-700'
    },
    {
      name: 'export',
      displayName: 'データエクスポート',
      description: 'CSV・JSON形式でデータ出力',
      icon: '📤',
      route: '/admin/database/export',
      color: 'bg-zinc-600 hover:bg-zinc-700'
    },
    {
      name: 'migration',
      displayName: 'データベースマイグレーション',
      description: 'スキーマ変更・テーブル構造管理',
      icon: '🔄',
      route: '/admin/database/migration',
      color: 'bg-neutral-600 hover:bg-neutral-700'
    }
  ]

  const handleTableClick = (route: string) => {
    router.push(route)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminSession')
    window.location.replace('/admin/login')
  }

  if (!currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                データベース管理 <span className="text-lg text-gray-600">(全テーブル対応)</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                ログイン中: <span className="font-medium text-indigo-600">{currentAdmin.email}</span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
                <span className="ml-2 text-xs text-gray-500">Ecfront2データベース - 全テーブル管理権限</span>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                メニューに戻る
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* データベーステーブル管理 */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">📊 データベーステーブル管理</h2>
              <p className="text-gray-600">各テーブルのデータを管理・編集できます</p>
            </div>

            {/* データベーステーブル一覧表 */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      アイコン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      テーブル名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      表示名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      説明
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      レコード数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {databaseTables.map((table, index) => (
                    <tr 
                      key={table.name} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleTableClick(table.route)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                        <span className="text-2xl">{table.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {table.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{table.displayName}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200">
                        <div className="text-sm text-gray-600 max-w-xs">{table.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {table.recordCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTableClick(table.route)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 px-3 py-1 border border-indigo-300 rounded hover:bg-indigo-50"
                        >
                          📊 管理
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTableClick(`/admin/database/export?table=${table.name.toLowerCase()}`)
                          }}
                          className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-300 rounded hover:bg-green-50"
                        >
                          📤 出力
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* システム管理ツール */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">🛠️ システム管理ツール</h2>
              <p className="text-gray-600">データベース全体の管理・バックアップ・インポート/エクスポート</p>
            </div>

            {/* システム管理ツール表 */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      アイコン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      ツール名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      説明
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {systemTools.map((tool) => (
                    <tr 
                      key={tool.name} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleTableClick(tool.route)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                        <span className="text-3xl">{tool.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{tool.displayName}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200">
                        <div className="text-sm text-gray-600 max-w-md">{tool.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTableClick(tool.route)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 px-4 py-2 border border-indigo-300 rounded hover:bg-indigo-50"
                        >
                          🛠️ 実行
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* データベース概要統計 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 データベース概要</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">テーブル</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-gray-600">ユーザー</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">--</div>
                <div className="text-sm text-gray-600">商品</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">--</div>
                <div className="text-sm text-gray-600">注文</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">--</div>
                <div className="text-sm text-gray-600">決済</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">--</div>
                <div className="text-sm text-gray-600">配送</div>
              </div>
            </div>
          </div>

          {/* フッター情報 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 データベース管理システム - Ecfront2全テーブル対応</p>
            <p className="mt-1">User, Product, Category, Order, Payment, Delivery, Inventory, Producer等の全テーブルを管理</p>
          </div>
        </div>
      </div>
    </div>
  )
}