'use client'

import { useState } from 'react'

export default function SimpleLoginTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('テスト中...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin'
        }),
      })
      
      const data = await response.json()
      
      setResult(`
Status: ${response.status}
Response: ${JSON.stringify(data, null, 2)}
      `)
      
      if (response.ok && data.user?.userType === 'admin') {
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        localStorage.setItem('adminSession', 'true')
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      }
      
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログインテスト
          </h2>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'テスト中...' : 'admin@example.com でログインテスト'}
          </button>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">結果:</label>
            <pre className="mt-1 p-3 bg-gray-100 border rounded text-xs overflow-auto max-h-96">
              {result || 'ボタンをクリックしてテストを実行'}
            </pre>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>✅ 正常時: 2秒後に管理画面にリダイレクト</p>
            <p>❌ 異常時: エラー内容を表示</p>
          </div>
        </div>
      </div>
    </div>
  )
}