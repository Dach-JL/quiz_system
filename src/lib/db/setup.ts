import sql from '../db';
import fs from 'fs';
import path from 'path';

async function setup() {
    console.log('🚀 Starting database setup...');
    try {
        const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // postgres.js doesn't support multiple statements in one query easily with some drivers
        // so we split by semicolon (simple approach) or just run the whole thing if it works.
        // For schema.sql, we can try running it as one block.
        await sql.unsafe(schema);

        console.log('✅ Database schema initialized successfully.');

        // Seed some initial data if tables are empty
        const quizzes = await sql`SELECT id FROM quizzes LIMIT 1`;
        if (quizzes.length === 0) {
            console.log('🌱 Seeding initial quiz data...');
            const [newQuiz] = await sql`
                INSERT INTO quizzes (title, description, category, difficulty)
                VALUES ('Web Development Basics', 'Test your knowledge of HTML, CSS, and JS', 'Tech', 'easy')
                RETURNING id
            `;

            await sql`
                INSERT INTO questions (quiz_id, question_text, options, correct_answer)
                VALUES 
                (${newQuiz.id}, 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Multi Language", "Home Tool Markup Language", "Hyperlink Text Management Language"]', 'Hyper Text Markup Language'),
                (${newQuiz.id}, 'Which property is used to change the background color in CSS?', '["color", "bgcolor", "background-color", "fill"]', 'background-color'),
                (${newQuiz.id}, 'Which HTML tag is used to define an internal style sheet?', '["<script>", "<css>", "<style>", "<design>"]', '<style>')
            `;
            console.log('✅ Seeding complete.');
        }

    } catch (error) {
        console.error('❌ Database setup failed:', error);
    } finally {
        process.exit();
    }
}

setup();
