import { NextRequest, NextResponse } from 'next/server'
import { smaregi } from '@/lib/smaregi'

// スマレジ在庫情報取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const productId = searchParams.get('productId')

    const stocks = await smaregi.getStock({
      storeId: storeId || undefined,
      productId: productId || undefined,
    })

    return NextResponse.json({
      success: true,
      data: stocks,
      message: `${stocks.length}件の在庫情報を取得しました`
    })
  } catch (error: any) {
    console.error('スマレジ在庫取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ在庫情報の取得に失敗しました'
    }, { status: 500 })
  }
}

// スマレジ在庫更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, storeId, stockQuantity, reason } = body

    if (!productId || !storeId || stockQuantity === undefined) {
      return NextResponse.json({
        success: false,
        error: '商品ID、店舗ID、在庫数は必須です'
      }, { status: 400 })
    }

    const stock = await smaregi.updateStock({
      productId,
      storeId,
      stockQuantity,
      reason,
    })

    return NextResponse.json({
      success: true,
      data: stock,
      message: '在庫を更新しました'
    })
  } catch (error: any) {
    console.error('スマレジ在庫更新エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ在庫の更新に失敗しました'
    }, { status: 500 })
  }
}