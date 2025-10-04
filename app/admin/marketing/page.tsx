'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MarketingManagement() {
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

  const marketingFeatures = [
    {
      id: 1,
      title: 'キャンペーン管理',
      description: 'セール・キャンペーン作成・效果測定',
      icon: '🎆',
      route: '/admin/marketing/campaigns',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      title: 'クーポン管理',
      description: 'クーポン作成・配布・使用状況管理',
      icon: '🎫',
      route: '/admin/marketing/coupons',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 3,
      title: 'SNS連携',
      description: 'SNS投稿・自動連携・ソーシャルメディア管理',
      icon: '📱',
      route: '/admin/marketing/social',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 4,
      title: 'メールマーケティング',
      description: 'メルマガ配信・セグメント配信・自動化',
      icon: '📧',
      route: '/admin/marketing/email',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 5,
      title: 'アフィリエイト',
      description: 'アフィリエイトパートナー管理・成果報酬',
      icon: '🤝',
      route: '/admin/marketing/affiliate',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 6,
      title: 'マーケティング分析',
      description: 'キャンペーン効果・ROI分析・レポート',
      icon: '📈',
      route: '/admin/marketing/analytics',
      color: 'bg-teal-500 hover:bg-teal-600'
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
                🎆 マーケティング管理
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                キャンペーン・クーポン・SNS・メールマーケティング管理システム
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">マーケティング機能一覧</h3>
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
                  {marketingFeatures.map((feature) => (
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
                          🎆 開く
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* マーケティング統計 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎆</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">アクティブキャンペーン</dt>
                      <dd className="text-lg font-medium text-gray-900">12件</dd>
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
                      <span className="text-white text-sm">🎫</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">クーポン使用率</dt>
                      <dd className="text-lg font-medium text-gray-900">23.4%</dd>
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
                      <span className="text-white text-sm">📧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">メール開封率</dt>
                      <dd className="text-lg font-medium text-gray-900">34.2%</dd>
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
                      <span className="text-white text-sm">📈</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">マーケティングROI</dt>
                      <dd className="text-lg font-medium text-gray-900">345%</dd>
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