import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 管理画面へのアクセス制御
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/login')) {
    // LocalStorageベースの認証のため、ミドルウェアでは簡単チェックのみ
    // 実際の認証はReactコンポーネント側で実施
    console.log('管理画面アクセス:', request.nextUrl.pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}