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

        const questions = await sql`SELECT id, question_text, options FROM questions WHERE quiz_id = ${id}`;

        return NextResponse.json({ quiz, questions });
    } catch (error) {
        console.error('Failed to fetch quiz details:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz details' }, { status: 500 });
    }
}
