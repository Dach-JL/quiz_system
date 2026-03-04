import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
    try {
        const quizzes = await sql`
            SELECT q.*, COUNT(qs.id) as question_count
            FROM quizzes q
            LEFT JOIN questions qs ON q.id = qs.quiz_id
            GROUP BY q.id
            ORDER BY q.created_at DESC
        `;
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
}
