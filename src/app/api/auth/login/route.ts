import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Find user
        const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({ user: userWithoutPassword, expires });

        // Save session in cookie
        (await cookies()).set("session", session, { expires, httpOnly: true });

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
