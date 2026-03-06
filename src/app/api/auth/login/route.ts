import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql, { isDbConnected } from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    console.log('[Login API] Received login request');
    
    try {
        // Parse request body
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            console.error('[Login API] Failed to parse request body:', parseError);
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            console.warn('[Login API] Missing email or password');
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            console.warn('[Login API] Invalid email or password type');
            return NextResponse.json(
                { error: "Email and password must be strings" },
                { status: 400 }
            );
        }

        console.log('[Login API] Attempting login for email:', email);

        // Check database connection
        if (!isDbConnected()) {
            console.error('[Login API] Database connection not configured. Check DATABASE_URL environment variable.');
            return NextResponse.json(
                { error: "Database connection not configured. Please set DATABASE_URL in your environment." },
                { status: 503 }
            );
        }

        // Find user
        let user;
        try {
            const users = await sql`SELECT * FROM users WHERE email = ${email}`;
            user = users[0];
            console.log('[Login API] Database query completed');
        } catch (dbError) {
            console.error('[Login API] Database query failed:', dbError instanceof Error ? dbError.message : dbError);
            return NextResponse.json(
                { error: "Database error. Please check your connection settings." },
                { status: 503 }
            );
        }

        if (!user) {
            console.warn('[Login API] User not found:', email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check password
        let isPasswordCorrect;
        try {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
            console.error('[Login API] Password comparison failed:', bcryptError instanceof Error ? bcryptError.message : bcryptError);
            return NextResponse.json(
                { error: "Failed to verify credentials" },
                { status: 500 }
            );
        }

        if (!isPasswordCorrect) {
            console.warn('[Login API] Invalid password for user:', email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        console.log('[Login API] User authenticated successfully:', email);

        // Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({ user: userWithoutPassword, expires });

        // Save session in cookie
        (await cookies()).set("session", session, { 
            expires, 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        console.log('[Login API] Session created successfully');

        return NextResponse.json({ 
            user: userWithoutPassword,
            message: "Login successful"
        });
    } catch (error) {
        console.error('[Login API] Unexpected error:', error instanceof Error ? error.message : error);
        console.error('[Login API] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            { error: "Internal server error. Check server logs for details." },
            { status: 500 }
        );
    }
}
