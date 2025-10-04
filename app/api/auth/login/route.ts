import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// API内で直接PrismaClientを作成
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://dev:dev@localhost:5432/dev"
    }
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('🔐 ログイン試行:', { email, password: '***' })

    // ユーザーを検索（findUniqueではなくfindFirstを使用）
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        userType: true,
      },
    })

    console.log('👤 検索結果:', user ? { 
      id: user.id, 
      email: user.email, 
      userType: user.userType,
      hasPassword: !!user.password 
    } : 'ユーザーが見つからない')

    if (!user) {
      console.log('❌ ユーザーが見つかりません')
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 401 })
    }

    // 簡単なパスワード検証（本来はハッシュ化されたパスワードと比較）
    console.log('🔑 パスワード検証:', { 
      入力パスワード: password, 
      DBパスワード: user.password,
      一致: user.password === password 
    })

    if (user.password !== password) {
      console.log('❌ パスワードが一致しません')
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 })
    }

    // 管理者権限チェック（厳密）
    if (user.userType !== 'admin') {
      console.log(`非管理者ログイン試行: ${email}, userType: ${user.userType}`)
      return NextResponse.json({ 
        error: `このシステムは管理者専用です。UserType: ${user.userType}のアカウントではログインできません。`,
        user: { userType: user.userType } // フロントエンドでの判定用
      }, { status: 403 })
    }

    // パスワードを除いてレスポンス
    const { password: _, ...userWithoutPassword } = user

    console.log(`管理者ログイン成功: ${email}`)
    return NextResponse.json({
      message: 'ログイン成功',
      user: userWithoutPassword,
      permissions: {
        canManageAllUsers: true,
        canManageCustomers: true,
        canManageAdmins: true
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = error instanceof Error && 'code' in error ? error.code : undefined
    
    console.error('エラーの詳細:', {
      message: errorMessage,
      code: errorCode
    })
    return NextResponse.json({ 
      error: 'ログインに失敗しました',
      details: errorMessage,
      code: errorCode 
    }, { status: 500 })
  }
}