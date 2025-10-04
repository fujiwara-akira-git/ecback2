import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Ecfront2連携統計情報を追加
    const stats = {
      totalUsers: users.length,
      adminCount: users.filter(u => u.userType === 'admin').length,
      customerCount: users.filter(u => u.userType === 'customer').length,
    }
    
    return NextResponse.json({ users, stats, ecfront2Compatible: true })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, userType } = await request.json()
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // 本来はハッシュ化が必要
        userType: userType || 'user',
      },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}