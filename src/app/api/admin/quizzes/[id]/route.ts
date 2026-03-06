import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { title, description, category, difficulty, time_limit, questions } = await request.json();

        // Validate time_limit if provided
        let timeLimitSeconds;
        if (time_limit !== undefined && time_limit !== null) {
            timeLimitSeconds = parseInt(time_limit, 10) * 60; // Convert minutes to seconds
            if (isNaN(timeLimitSeconds) || timeLimitSeconds <= 0) {
                return NextResponse.json(
                    { error: 'Time limit must be a positive number' },
                    { status: 400 }
                );
            }
        }

        // Update quiz metadata
        if (timeLimitSeconds !== undefined) {
            await sql`
                UPDATE quizzes
                SET title = ${title}, description = ${description}, category = ${category}, difficulty = ${difficulty}, time_limit = ${timeLimitSeconds}
                WHERE id = ${id}
            `;
        } else {
            await sql`
                UPDATE quizzes
                SET title = ${title}, description = ${description}, category = ${category}, difficulty = ${difficulty}
                WHERE id = ${id}
            `;
        }

        // Simple strategy: delete old questions and insert new ones
        // In a production app, we might want to diff them to keep result associations,
        // but for this project, a full refresh is acceptable.
        await sql`DELETE FROM questions WHERE quiz_id = ${id}`;

        if (questions && questions.length > 0) {
            for (const q of questions) {
                await sql`
                    INSERT INTO questions (quiz_id, question_text, options, correct_answer)
                    VALUES (${id}, ${q.question_text}, ${JSON.stringify(q.options)}, ${q.correct_answer.toString()})
                `;
            }
        }

        return NextResponse.json({ message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Failed to update quiz:', error);
        return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await sql`DELETE FROM quizzes WHERE id = ${id}`;
        return NextResponse.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Failed to delete quiz:', error);
        return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
    }
}
