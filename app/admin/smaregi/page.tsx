'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SmaregiHealth {
  status: string
  timestamp: string
}

interface SmaregiProduct {
  productId: string
  productCode: string
  productName: string
  price: number
  categoryId?: string
  stockQuantity?: number
}

export default function SmaregiConnection() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState<SmaregiHealth | null>(null)
  const [products, setProducts] = useState<SmaregiProduct[]>([])
  const [config, setConfig] = useState({
    contractId: '',
    accessToken: '',
    baseUrl: 'https://api.smaregi.jp/v1'
  })
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

    // 初期接続確認
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/smaregi/health')
      const result = await response.json()
      
      if (result.success) {
        setHealthStatus(result.data)
      } else {
        setHealthStatus({
          status: 'disconnected',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('接続確認エラー:', error)
      setHealthStatus({
        status: 'error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async () => {
    if (!config.contractId || !config.accessToken) {
      alert('Contract IDとAccess Tokenを入力してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/smaregi/health', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setHealthStatus(result.data)
        alert('スマレジ設定を更新しました')
      } else {
        alert(`設定更新エラー: ${result.error}`)
      }
    } catch (error) {
      console.error('設定更新エラー:', error)
      alert('設定更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/smaregi/products?limit=10')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data)
      } else {
        alert(`商品取得エラー: ${result.error}`)
      }
    } catch (error) {
      console.error('商品取得エラー:', error)
      alert('商品取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'disconnected': return 'text-red-600 bg-red-50 border-red-200'
      case 'error': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✅'
      case 'disconnected': return '❌'
      case 'error': return '⚠️'
      default: return '❓'
    }
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
                📱 スマレジ連携
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                スマレジAPIとの接続・商品・在庫・売上データ連携
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
          
          {/* 接続状態 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">接続状態</h3>
              
              {healthStatus && (
                <div className={`p-4 border rounded-lg ${getStatusColor(healthStatus.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(healthStatus.status)}</span>
                      <div>
                        <p className="font-medium">
                          ステータス: {healthStatus.status === 'connected' ? '接続中' : 
                                     healthStatus.status === 'disconnected' ? '切断' : 'エラー'}
                        </p>
                        <p className="text-sm">
                          確認日時: {new Date(healthStatus.timestamp).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={checkConnection}
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? '確認中...' : '再確認'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 設定 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">スマレジ設定</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract ID
                  </label>
                  <input
                    type="text"
                    value={config.contractId}
                    onChange={(e) => setConfig({...config, contractId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="スマレジContract IDを入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token
                  </label>
                  <input
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({...config, accessToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="スマレジAccess Tokenを入力"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL
                </label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={updateConfig}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? '設定中...' : '設定更新'}
              </button>
            </div>
          </div>

          {/* 商品データテスト */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-300">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">商品データテスト</h3>
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '取得中...' : '商品取得'}
                </button>
              </div>
              
              {products.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                          商品ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                          商品コード
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                          商品名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                          価格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          在庫数
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.productId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                            {product.productId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                            {product.productCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                            {product.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r">
                            ¥{product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stockQuantity || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  商品データを取得するには「商品取得」ボタンをクリックしてください
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}