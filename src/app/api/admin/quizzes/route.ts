import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { title, description, category, difficulty, time_limit, questions } = await request.json();

        // Validate required fields
        if (!title || !category) {
            return NextResponse.json(
                { error: 'Title and category are required' },
                { status: 400 }
            );
        }

        // Validate time_limit (must be positive number, convert minutes to seconds)
        let timeLimitSeconds = 600; // Default 10 minutes
        if (time_limit !== undefined && time_limit !== null) {
            timeLimitSeconds = parseInt(time_limit, 10) * 60; // Convert minutes to seconds
            if (isNaN(timeLimitSeconds) || timeLimitSeconds <= 0) {
                return NextResponse.json(
                    { error: 'Time limit must be a positive number' },
                    { status: 400 }
                );
            }
        }

        // Create quiz with time limit
        const [quiz] = await sql`
            INSERT INTO quizzes (title, description, category, difficulty, time_limit)
            VALUES (${title}, ${description}, ${category}, ${difficulty}, ${timeLimitSeconds})
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

        return NextResponse.json({ 
            message: 'Quiz created successfully',
            quizId: quiz.id 
        });
    } catch (error) {
        console.error('Failed to create quiz:', error);
        return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
    }
}
