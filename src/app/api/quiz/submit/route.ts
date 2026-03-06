import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        // For now, if no session, we can either block or use a guest ID
        // Given Phase 2 is done, we should expect a session or at least a logged in user
        const userId = session?.user?.id || 1; // Fallback to user 1 for dev if needed

        const { quizId, answers, timeExpired } = await request.json();

        // Fetch correct answers for this quiz
        const questions = await sql`
            SELECT id, correct_answer
            FROM questions
            WHERE quiz_id = ${quizId}
        `;

        let score = 0;
        questions.forEach((q: any) => {
            if (answers[q.id] === q.correct_answer) {
                score++;
            }
        });

        const totalQuestions = questions.length;

        // Store result in DB with time_expired flag
        const [result] = await sql`
            INSERT INTO results (user_id, quiz_id, score, total_questions, time_expired)
            VALUES (${userId}, ${quizId}, ${score}, ${totalQuestions}, ${!!timeExpired})
            RETURNING id as "resultId"
        `;

        return NextResponse.json({ 
            resultId: result.resultId, 
            score, 
            totalQuestions,
            timeExpired: !!timeExpired 
        });
    } catch (error) {
        console.error('Failed to submit quiz:', error);
        return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
    }
}
