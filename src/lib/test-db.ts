import sql from './db';

async function testConnection() {
    console.log('🔍 Testing database connection...');
    try {
        const result = await sql`SELECT 1 as connection_test`;
        console.log('✅ Connection successful:', result);

        const quizzes = await sql`SELECT id, title FROM quizzes`;
        console.log('📊 Current quizzes in DB:', quizzes);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        process.exit();
    }
}

testConnection();
