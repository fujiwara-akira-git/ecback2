import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        // シンプルなモック: 環境変数でテスト管理者を設定しておく
        const adminEmail = process.env.ECBACK_ADMIN_EMAIL
        const adminPassword = process.env.ECBACK_ADMIN_PASSWORD
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return { id: 'admin', email: adminEmail, name: 'ecback-admin', role: 'ADMIN' }
        }
        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.role = (token as any).role
      return session
    }
  },
  pages: { signIn: '/signin' }
})

export { handler as GET, handler as POST }
