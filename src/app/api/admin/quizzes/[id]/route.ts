import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { title, description, category, difficulty } = await request.json();

        await sql`
            UPDATE quizzes 
            SET title = ${title}, description = ${description}, category = ${category}, difficulty = ${difficulty}
            WHERE id = ${id}
        `;

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
