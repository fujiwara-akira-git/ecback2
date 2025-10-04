// データベース接続確認スクリプト
process.env.DATABASE_URL = "postgresql://dev:dev@localhost:5432/dev";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 データベース接続確認中...');
    
    // データベース接続テスト
    await prisma.$connect();
    console.log('✅ データベース接続成功');
    
    // テーブル一覧を取得
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    console.log('\n📋 テーブル一覧:');
    tables.forEach(table => {
      console.log('  -', table.table_name);
    });
    
    // Userテーブルの構造を確認
    if (tables.some(t => t.table_name === 'User' || t.table_name === 'users')) {
      const userTableName = tables.find(t => t.table_name === 'User' || t.table_name === 'users').table_name;
      
      console.log(`\n🏗️  ${userTableName}テーブルの構造:`);
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = ${userTableName} AND table_schema = 'public';
      `;
      
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // 既存データを確認
      try {
        const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "${userTableName}";`;
        console.log(`\n📊 既存ユーザー数: ${userCount[0].count}`);
        
        if (userCount[0].count > 0) {
          const users = await prisma.$queryRaw`SELECT email, "userType" FROM "${userTableName}" LIMIT 5;`;
          console.log('\n👥 既存ユーザー（最大5件）:');
          users.forEach(user => {
            console.log(`  - ${user.email} (${user.userType || 'no userType'})`);
          });
        }
      } catch (e) {
        console.log('⚠️  ユーザーデータの取得でエラー:', e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();