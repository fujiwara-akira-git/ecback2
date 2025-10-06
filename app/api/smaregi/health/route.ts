import { NextRequest, NextResponse } from 'next/server'
import { smaregi } from '@/lib/smaregi'

// スマレジAPI接続確認
export async function GET() {
  try {
    const healthStatus = await smaregi.healthCheck()
    
    return NextResponse.json({
      success: true,
      data: healthStatus,
      message: 'スマレジAPI接続確認完了'
    })
  } catch (error: any) {
    console.error('スマレジAPI接続エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジAPI接続に失敗しました',
      data: {
        status: 'error',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

// スマレジ設定更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractId, accessToken, baseUrl } = body

    if (!contractId || !accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Contract IDとAccess Tokenは必須です'
      }, { status: 400 })
    }

    // 環境変数を更新（実際の実装では.envファイルまたはデータベースに保存）
    process.env.SMAREGI_CONTRACT_ID = contractId
    process.env.SMAREGI_ACCESS_TOKEN = accessToken
    if (baseUrl) process.env.SMAREGI_BASE_URL = baseUrl

    // 接続テスト
    const healthStatus = await smaregi.healthCheck()

    return NextResponse.json({
      success: true,
      data: healthStatus,
      message: 'スマレジ設定を更新しました'
    })
  } catch (error: any) {
    console.error('スマレジ設定更新エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ設定の更新に失敗しました'
    }, { status: 500 })
  }
}