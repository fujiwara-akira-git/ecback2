import { NextRequest, NextResponse } from 'next/server'
import { smaregi } from '@/lib/smaregi'

// スマレジ取引情報取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const transactions = await smaregi.getTransactions({
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })

    return NextResponse.json({
      success: true,
      data: transactions,
      message: `${transactions.length}件の取引情報を取得しました`
    })
  } catch (error: any) {
    console.error('スマレジ取引取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ取引情報の取得に失敗しました'
    }, { status: 500 })
  }
}

// スマレジ取引作成（売上登録）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, paymentMethod, customerId } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({
        success: false,
        error: '商品アイテムは必須です'
      }, { status: 400 })
    }

    const transaction = await smaregi.createTransaction({
      items,
      paymentMethod,
      customerId,
    })

    return NextResponse.json({
      success: true,
      data: transaction,
      message: '取引を作成しました'
    })
  } catch (error: any) {
    console.error('スマレジ取引作成エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ取引の作成に失敗しました'
    }, { status: 500 })
  }
}