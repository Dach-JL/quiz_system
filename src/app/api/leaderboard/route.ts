import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
    try {
        // Fetch top scores from the results table, joined with users and quizzes
        const leaderboard = await sql`
            SELECT 
                u.name as username, 
                q.title as quiz_title, 
                r.score, 
                r.total_questions,
                r.completed_at,
                (CAST(r.score AS FLOAT) / r.total_questions * 100) as percentage
            FROM results r
            JOIN users u ON r.user_id = u.id
            JOIN quizzes q ON r.quiz_id = q.id
            ORDER BY percentage DESC, r.completed_at ASC
            LIMIT 20
        `;
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
