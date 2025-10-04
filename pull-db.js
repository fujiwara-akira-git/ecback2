require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

try {
  execSync('npx prisma db pull', { stdio: 'inherit' });
} catch (error) {
  console.error('Error:', error.message);
}