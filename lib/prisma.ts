import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 直接接続文字列を使用
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://dev:dev@localhost:5432/dev"
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma