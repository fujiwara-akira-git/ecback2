import { NextRequest, NextResponse } from 'next/server'
import { smaregi } from '@/lib/smaregi'

// スマレジ商品情報取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const categoryId = searchParams.get('categoryId')

    const products = await smaregi.getProducts({
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      categoryId: categoryId || undefined,
    })

    return NextResponse.json({
      success: true,
      data: products,
      message: `${products.length}件の商品情報を取得しました`
    })
  } catch (error: any) {
    console.error('スマレジ商品取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ商品情報の取得に失敗しました'
    }, { status: 500 })
  }
}

// スマレジ商品作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productCode, productName, price, categoryId } = body

    if (!productCode || !productName || !price) {
      return NextResponse.json({
        success: false,
        error: '商品コード、商品名、価格は必須です'
      }, { status: 400 })
    }

    const product = await smaregi.createProduct({
      productCode,
      productName,
      price,
      categoryId,
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: '商品を作成しました'
    })
  } catch (error: any) {
    console.error('スマレジ商品作成エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'スマレジ商品の作成に失敗しました'
    }, { status: 500 })
  }
}