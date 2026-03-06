import { config } from 'dotenv';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function setup() {
    console.log('🚀 Starting database setup...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found in .env.local');
        process.exit(1);
    }
    
    let sql;
    try {
        sql = postgres(databaseUrl, {
            ssl: databaseUrl.includes('localhost') ? false : 'require',
            max: 1,
        });
        
        // Read schema file
        const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📄 Reading schema from:', schemaPath);
        console.log('📄 Schema size:', schema.length, 'bytes');
        
        // Split by semicolons and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        
        console.log('📋 Found', statements.length, 'statements');
        
        if (statements.length === 0) {
            console.log('⚠️  No statements found, trying to run schema as single block...');
            await sql.unsafe(schema);
            console.log('✅ Schema applied as single block');
        }
        
        for (const statement of statements) {
            try {
                console.log('🔵 Executing:', statement.substring(0, 60).replace(/\n/g, ' ') + '...');
                await sql.unsafe(statement);
                console.log('✅ Done');
            } catch (err) {
                const error = err as any;
                // Ignore "already exists" errors
                if (error.code === '42P07') {
                    console.log('⚠️  Table already exists');
                } else {
                    console.error('❌ Error:', error.message);
                    throw error;
                }
            }
        }
        
        console.log('\n✅ Database schema setup complete!');
        
        // Check if we have any users
        const usersResult = await sql`SELECT COUNT(*) FROM users`;
        const userCount = parseInt(usersResult[0]?.count || '0');
        
        if (userCount === 0) {
            console.log('\n🌱 Seeding initial data...');
            
            // Create a test admin user (password: admin123)
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await sql`
                INSERT INTO users (name, email, password, role)
                VALUES ('Admin User', 'admin@example.com', ${hashedPassword}, 'admin')
            `;
            
            console.log('✅ Created admin user (email: admin@example.com, password: admin123)');
            
            // Create a test user (password: user123)
            const userPassword = await bcrypt.hash('user123', 10);
            await sql`
                INSERT INTO users (name, email, password, role)
                VALUES ('Test User', 'user@example.com', ${userPassword}, 'user')
            `;
            
            console.log('✅ Created test user (email: user@example.com, password: user123)');
            
            // Create sample quiz
            const quizResult = await sql`
                INSERT INTO quizzes (title, description, category, difficulty)
                VALUES ('Web Development Basics', 'Test your knowledge of HTML, CSS, and JS', 'Tech', 'easy')
                RETURNING id
            `;
            
            const quizId = quizResult[0]?.id;
            
            if (quizId) {
                await sql`
                    INSERT INTO questions (quiz_id, question_text, options, correct_answer)
                    VALUES 
                    (${quizId}, 'What does HTML stand for?', 
                     '["Hyper Text Markup Language", "High Tech Multi Language", "Home Tool Markup Language", "Hyperlink Text Management Language"]',
                     'Hyper Text Markup Language'),
                    (${quizId}, 'Which property is used to change the background color in CSS?',
                     '["color", "bgcolor", "background-color", "fill"]',
                     'background-color'),
                    (${quizId}, 'Which HTML tag is used to define an internal style sheet?',
                     '["<script>", "<css>", "<style>", "<design>"]',
                     '<style>')
                `;
                
                console.log('✅ Created sample quiz with 3 questions');
            }
            
            console.log('\n🎉 Seeding complete!');
        } else {
            console.log(`ℹ️  Database already has ${userCount} user(s)`);
        }
        
        console.log('\n✅ Database setup finished successfully!');
        
    } catch (error) {
        console.error('\n❌ Database setup failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    } finally {
        if (sql) {
            await sql.end();
        }
    }
}

setup();
