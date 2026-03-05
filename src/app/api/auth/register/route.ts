import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { name, email, password, adminCode } = await request.json();

        // Determine role based on admin code
        const role = adminCode === 'ADMIN2026' ? 'admin' : 'user';

        // Check if user exists
        const [existingUser] = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [user] = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${role})
            RETURNING id, name, email, role
        `;

        // Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({ user, expires });

        // Save session in cookie
        (await cookies()).set("session", session, { expires, httpOnly: true });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
