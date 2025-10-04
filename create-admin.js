// 環境変数を直接設定
process.env.DATABASE_URL = "postgresql://dev:dev@localhost:5432/dev";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // 既存のユーザーをチェック
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (existingUser) {
      console.log('❌ ユーザーが既に存在します:', existingUser.email);
      console.log('   UserType:', existingUser.userType);
      return;
    }

    // 管理者ユーザーを作成
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'システム管理者',
        password: 'admin', // 本来はハッシュ化が推奨
        userType: 'admin'
      }
    });

    console.log('✅ 管理者ユーザーを作成しました:');
    console.log('   Email:', adminUser.email);
    console.log('   Name:', adminUser.name);
    console.log('   UserType:', adminUser.userType);
    console.log('   ID:', adminUser.id);
    console.log('');
    console.log('🔐 ログイン情報:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin');
    console.log('');
    console.log('🌐 管理画面URL: http://localhost:3001/admin/login');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    
    if (error.code === 'P2002') {
      console.log('💡 このメールアドレスは既に使用されています。');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();