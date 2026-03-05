import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const [quiz] = await sql`SELECT * FROM quizzes WHERE id = ${id}`;
        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const questions = await sql`SELECT id, question_text, options, correct_answer FROM questions WHERE quiz_id = ${id}`;

        // Ensure options is an array (Postgres driver usually handles JSONB, but let's be safe)
        const formattedQuestions = questions.map(q => ({
            ...q,
            correct_answer: parseInt(q.correct_answer) || 0
        }));

        return NextResponse.json({ quiz, questions: formattedQuestions });
    } catch (error) {
        console.error('Failed to fetch quiz details:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz details' }, { status: 500 });
    }
}
