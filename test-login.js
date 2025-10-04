// ログインテスト用の簡単なスクリプト
process.env.DATABASE_URL = "postgresql://dev:dev@localhost:5432/dev";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🧪 ログイン処理のテスト');
    
    const email = 'admin@example.com';
    const password = 'admin';
    
    console.log('1️⃣ ユーザー検索中...');
    
    // findFirstを使ってユーザーを検索
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        userType: true,
      },
    });
    
    console.log('👤 検索結果:', user);
    
    if (!user) {
      console.log('❌ ユーザーが見つかりません');
      return;
    }
    
    console.log('2️⃣ パスワード検証中...');
    console.log('入力パスワード:', password);
    console.log('DBパスワード:', user.password);
    console.log('一致:', user.password === password);
    
    if (user.password !== password) {
      console.log('❌ パスワードが一致しません');
      return;
    }
    
    console.log('3️⃣ UserType検証中...');
    console.log('UserType:', user.userType);
    console.log('管理者チェック:', user.userType === 'admin');
    
    if (user.userType !== 'admin') {
      console.log('❌ 管理者権限がありません');
      return;
    }
    
    console.log('✅ 認証成功！');
    console.log('認証ユーザー:', {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType
    });
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();