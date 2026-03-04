import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { title, description, category, difficulty, questions } = await request.json();

        // Use a transaction
        await sql.begin(async (sql) => {
            const [quiz] = await sql`
                INSERT INTO quizzes (title, description, category, difficulty)
                VALUES (${title}, ${description}, ${category}, ${difficulty})
                RETURNING id
            `;

            if (questions && questions.length > 0) {
                for (const q of questions) {
                    await sql`
                        INSERT INTO questions (quiz_id, question_text, options, correct_answer)
                        VALUES (${quiz.id}, ${q.question_text}, ${JSON.stringify(q.options)}, ${q.correct_answer})
                    `;
                }
            }
        });

        return NextResponse.json({ message: 'Quiz created successfully' });
    } catch (error) {
        console.error('Failed to create quiz:', error);
        return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
    }
}
