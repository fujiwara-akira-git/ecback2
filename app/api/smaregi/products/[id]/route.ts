import { NextRequest, NextResponse } from 'next/server'
import { smaregi } from '@/lib/smaregi'

// 特定商品の更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const productId = params.id

    const product = await smaregi.updateProduct(productId, body)

    return NextResponse.json({
      success: true,
      data: product,
      message: '商品を更新しました'
    })
  } catch (error: any) {
    console.error('スマレジ商品更新エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ商品の更新に失敗しました'
    }, { status: 500 })
  }
}

// 特定商品の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    await smaregi.deleteProduct(productId)

    return NextResponse.json({
      success: true,
      message: '商品を削除しました'
    })
  } catch (error: any) {
    console.error('スマレジ商品削除エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ商品の削除に失敗しました'
    }, { status: 500 })
  }
}