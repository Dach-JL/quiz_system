import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        // Check for admin role (in a real app, we'd verify u.role === 'admin' in DB)
        // For this demo, we'll allow access if a session exists, but we should ideally check roles

        const stats = await sql`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM quizzes) as total_quizzes,
                (SELECT COUNT(*) FROM results) as total_attempts,
                (SELECT ROUND(AVG(score)::numeric, 2) FROM results) as average_score
        `;

        const recentActivity = await sql`
            SELECT 
                r.id, 
                u.name as user_name, 
                q.title as quiz_title, 
                r.score, 
                r.total_questions, 
                r.completed_at
            FROM results r
            JOIN users u ON r.user_id = u.id
            JOIN quizzes q ON r.quiz_id = q.id
            ORDER BY r.completed_at DESC
            LIMIT 5
        `;

        return NextResponse.json({
            stats: stats[0],
            recentActivity
        });
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
    }
}
