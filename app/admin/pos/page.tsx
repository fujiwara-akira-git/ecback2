'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function POSManagement() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser')
    const adminSession = localStorage.getItem('adminSession')
    
    if (!adminUser || !adminSession) {
      window.location.replace('/admin/login')
      return
    }
    
    if (adminUser) {
      setCurrentAdmin(JSON.parse(adminUser))
    }
  }, [])

  const posFeatures = [
    {
      id: 1,
      title: 'レジシステム',
      description: '商品スキャン・決済処理・レシート発行',
      icon: '🛒',
      route: '/admin/pos/register',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      title: '売上管理',
      description: '日次・月次売上・売上分析・レポート',
      icon: '📊',
      route: '/admin/pos/sales',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 3,
      title: '決済管理',
      description: '現金・カード・電子マネー決済処理',
      icon: '💳',
      route: '/admin/pos/payments',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 4,
      title: '返品・交換',
      description: '返品処理・交換処理・返金管理',
      icon: '🔄',
      route: '/admin/pos/returns',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 5,
      title: 'レシート管理',
      description: 'レシート再発行・取引履歴・印刷設定',
      icon: '🧾',
      route: '/admin/pos/receipts',
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      id: 6,
      title: 'POSレポート',
      description: '売上レポート・商品別分析・時間帯分析',
      icon: '📈',
      route: '/admin/pos/reports',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 7,
      title: 'スマレジ連携',
      description: 'スマレジAPI接続・商品同期・売上連携',
      icon: '📱',
      route: '/admin/smaregi',
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ]

  const handleFeatureClick = (route: string) => {
    router.push(route)
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
                🛒 販売管理（POS）
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                レジ機能・売上管理・決済処理システム
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                メインメニューに戻る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* 機能一覧表 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">POS機能一覧</h3>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      アイコン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                      機能名
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
                  {posFeatures.map((feature) => (
                    <tr 
                      key={feature.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleFeatureClick(feature.route)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                        <span className="text-2xl">{feature.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200">
                        <div className="text-sm text-gray-600 max-w-md">{feature.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFeatureClick(feature.route)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 px-4 py-2 border border-indigo-300 rounded hover:bg-indigo-50"
                        >
                          🛒 開く
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">今日の売上</dt>
                      <dd className="text-lg font-medium text-gray-900">¥123,456</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">取引件数</dt>
                      <dd className="text-lg font-medium text-gray-900">45件</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🛒</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">平均客単価</dt>
                      <dd className="text-lg font-medium text-gray-900">¥2,743</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⏰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">営業時間</dt>
                      <dd className="text-lg font-medium text-gray-900">8h 30m</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}