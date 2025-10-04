'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminMainMenu() {
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

  const menuItems = [
    {
      id: 1,
      title: '販売管理（POS）',
      description: 'レジ機能・売上管理・決済処理',
      icon: '🛒',
      route: '/admin/pos',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      title: '顧客管理',
      description: '顧客情報・購入履歴・ポイント管理',
      icon: '👥',
      route: '/admin/customers',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 3,
      title: '取引先管理',
      description: 'サプライヤー・仕入先・パートナー管理',
      icon: '🤝',
      route: '/admin/suppliers',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 4,
      title: '商品マスター管理',
      description: '商品登録・価格設定・カテゴリ管理',
      icon: '📦',
      route: '/admin/products',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 5,
      title: '在庫管理（入出荷管理）',
      description: '在庫数・入荷・出荷・棚卸し管理',
      icon: '📊',
      route: '/admin/inventory',
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      id: 6,
      title: '配送管理',
      description: '配送状況・ドライバー・ルート管理',
      icon: '🚚',
      route: '/admin/delivery',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 7,
      title: '支払い管理',
      description: '決済処理・請求書・売掛金管理',
      icon: '💳',
      route: '/admin/payments',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      id: 8,
      title: 'Webサイト管理',
      description: 'コンテンツ・ページ・SEO・デザイン管理',
      icon: '🌐',
      route: '/admin/website',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      id: 9,
      title: 'マーケティング管理',
      description: 'キャンペーン・メール配信・分析',
      icon: '📈',
      route: '/admin/marketing',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 10,
      title: 'CRUD（データベース管理）',
      description: '全テーブル管理・データ操作・システム設定・バックアップ',
      icon: '🗄️',
      route: '/admin/database',
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ]

  const handleMenuClick = (route: string) => {
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
                管理システム <span className="text-lg text-gray-600">(Ecfront2連携)</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                ログイン中: <span className="font-medium text-indigo-600">{currentAdmin.email}</span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">メインメニュー</h2>
            <p className="text-gray-600">管理したい項目を選択してください</p>
          </div>

          {/* メニューグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.route)}
                className={`${item.color} text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                    {item.id.toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            ))}
          </div>

          {/* 統計情報 */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">システム概要</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-gray-600">管理機能</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-gray-600">登録ユーザー</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-600">管理者</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">23</div>
                <div className="text-sm text-gray-600">顧客</div>
              </div>
            </div>
          </div>

          {/* フッター情報 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 管理システム - Ecfront2データベース連携</p>
            <p className="mt-1">全ての機能は管理者権限で実行されます</p>
          </div>
        </div>
      </div>
    </div>
  )
}