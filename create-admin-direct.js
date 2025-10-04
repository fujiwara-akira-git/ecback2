// 直接SQLで管理者ユーザーを作成
process.env.DATABASE_URL = "postgresql://dev:dev@localhost:5432/dev";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUserDirectly() {
  try {
    console.log('🔍 管理者ユーザーの存在確認中...');
    
    // 既存の管理者ユーザーをチェック
    const existingAdmins = await prisma.$queryRaw`
      SELECT id, email, "userType" 
      FROM "User" 
      WHERE email = 'admin@example.com' OR "userType" = 'admin';
    `;
    
    if (existingAdmins.length > 0) {
      console.log('📋 既存の管理者ユーザー:');
      existingAdmins.forEach(user => {
        console.log(`  - ${user.email} (${user.userType})`);
      });
      
      if (existingAdmins.some(u => u.email === 'admin@example.com')) {
        console.log('⚠️  admin@example.com は既に存在します。');
        return;
      }
    }

    // 新しいIDを生成（CUIDスタイル）
    const userId = 'admin_' + Date.now();
    
    console.log('👤 管理者ユーザーを作成中...');
    
    // 管理者ユーザーを挿入
    await prisma.$queryRaw`
      INSERT INTO "User" (
        id, email, name, password, "userType", "createdAt", "updatedAt"
      ) VALUES (
        ${userId},
        'admin@example.com',
        'システム管理者',
        'admin',
        'admin',
        NOW(),
        NOW()
      );
    `;

    console.log('✅ 管理者ユーザーを作成しました！');
    console.log('');
    console.log('🔐 ログイン情報:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin');
    console.log('   UserType: admin');
    console.log('   ID:', userId);
    console.log('');
    console.log('🌐 管理画面URL: http://localhost:3001/admin/login');
    
    // 作成確認
    const newUser = await prisma.$queryRaw`
      SELECT id, email, name, "userType" 
      FROM "User" 
      WHERE email = 'admin@example.com';
    `;
    
    console.log('');
    console.log('✅ 作成確認:', newUser[0]);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    
    if (error.message.includes('duplicate key')) {
      console.log('💡 このユーザーは既に存在している可能性があります。');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUserDirectly();