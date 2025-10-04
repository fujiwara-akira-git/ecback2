'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  name: string | null
  userType: string
  createdAt: string
  updatedAt: string
}

interface Post {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number
  author: {
    name: string | null
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function CRUDDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'categories'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'admin' | 'customer'>('all')
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
    
    // データを取得
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/${activeTab}`)
      const data = await response.json()
      
      if (activeTab === 'users') {
        // Ecfront2連携対応のAPIレスポンス処理
        if (data.users) {
          setUsers(data.users)
        } else {
          setUsers(data)
        }
      }
      else if (activeTab === 'posts') setPosts(data)
      else if (activeTab === 'categories') setCategories(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return
    
    try {
      const response = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    if (userTypeFilter === 'all') return true
    return user.userType === userTypeFilter
  })

  const renderUsers = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value as 'all' | 'admin' | 'customer')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">全てのユーザー</option>
            <option value="admin">管理者のみ</option>
            <option value="customer">顧客のみ</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          管理者: {users.filter(u => u.userType === 'admin').length}名 | 
          顧客: {users.filter(u => u.userType === 'customer').length}名 | 
          合計: {users.length}名
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.userType === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : user.userType === 'customer'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.userType === 'admin' ? '管理者' : user.userType === 'customer' ? '顧客' : user.userType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )

  const renderPosts = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.author.name || post.author.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {post.published ? '公開' : '下書き'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(post.createdAt).toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCategories = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.description || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(category.createdAt).toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                CRUD（データ管理） <span className="text-lg text-gray-600">(Ecfront2連携)</span>
              </h1>
              {currentAdmin && (
                <p className="mt-1 text-sm text-gray-600">
                  ログイン中: <span className="font-medium text-indigo-600">{currentAdmin.email}</span> 
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">管理者</span>
                  <span className="ml-2 text-xs text-gray-500">全ユーザー（admin/customer）管理権限あり</span>
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                メニューに戻る
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminUser')
                  localStorage.removeItem('adminSession')
                  window.location.replace('/admin/login')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Ecfront2連携統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総顧客数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.filter(u => u.userType === 'customer').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        管理者数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.filter(u => u.userType === 'admin').length}
                      </dd>
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
                      <span className="text-white text-sm">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        投稿数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {posts.length}
                      </dd>
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
                      <span className="text-white text-sm">📂</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        カテゴリ数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {categories.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ユーザー管理
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                投稿管理
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                カテゴリ管理
              </button>
            </nav>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'users' && '全ユーザー管理 (管理者・顧客)'}
                {activeTab === 'posts' && '投稿一覧'}
                {activeTab === 'categories' && 'カテゴリ一覧'}
              </h2>
              <button
                onClick={() => router.push(`/admin/${activeTab}/create`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                新規作成
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'posts' && renderPosts()}
                {activeTab === 'categories' && renderCategories()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}