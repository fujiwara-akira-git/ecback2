'use client'

import { useState } from 'react'

export default function DirectLoginTest() {
  const [step, setStep] = useState(1)
  const [apiResult, setApiResult] = useState('')
  const [loginResult, setLoginResult] = useState('')

  const step1_testAPI = async () => {
    setApiResult('API テスト中...')
    
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
      setApiResult(`✅ API正常\nStatus: ${response.status}\nUser: ${data.user?.email}\nType: ${data.user?.userType}`)
      
      if (response.ok && data.user?.userType === 'admin') {
        setStep(2)
      }
      
    } catch (error) {
      setApiResult(`❌ API エラー: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const step2_directRedirect = () => {
    setLoginResult('管理画面に移動中...')
    
    // 直接URLを変更
    window.location.replace('/admin')
  }

  const step3_manualAccess = () => {
    window.open('/admin', '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            直接ログインテスト
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Step 1: API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Step 1: API認証テスト</h3>
            <button
              onClick={step1_testAPI}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              API認証をテスト
            </button>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {apiResult || 'ボタンをクリックしてAPIをテスト'}
            </pre>
          </div>

          {/* Step 2: Direct Redirect */}
          {step >= 2 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Step 2: 直接リダイレクト</h3>
              <button
                onClick={step2_directRedirect}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                管理画面に直接移動
              </button>
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {loginResult || '上のボタンで管理画面に移動'}
              </pre>
            </div>
          )}

          {/* Step 3: Manual Access */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Step 3: 手動アクセス</h3>
            <button
              onClick={step3_manualAccess}
              className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              新しいタブで管理画面を開く
            </button>
            <p className="text-sm text-gray-600">
              認証をスキップして管理画面に直接アクセス
            </p>
          </div>

          {/* Direct Links */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">直接リンク</h3>
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="block text-blue-600 hover:text-blue-800"
                target="_blank"
              >
                🔗 /admin (新しいタブ)
              </a>
              <a 
                href="/admin/login" 
                className="block text-blue-600 hover:text-blue-800"
                target="_blank"
              >
                🔗 /admin/login (新しいタブ)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}