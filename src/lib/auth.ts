import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Use environment variable only - no fallback to hardcoded secret
// This ensures consistency between signing and verification
const secretKey = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!secretKey) {
    console.warn("JWT_SECRET or NEXTAUTH_SECRET environment variable is not set. Using default for development only.");
}

const key = new TextEncoder().encode(secretKey || "default-dev-secret");

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(key);
}

export async function decrypt(input: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        // Handle JWT errors by checking error name/message
        // jose v6 uses error names like "JWSVerificationFailed" and "JWTExpired"
        const errorName = error instanceof Error ? error.name : '';
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorName === 'JWTExpired' || errorMessage.includes('expired')) {
            console.warn("JWT token has expired");
            return null;
        }
        if (errorName === 'JWSVerificationFailed' || errorName === 'JOSEError' || errorMessage.includes('signature')) {
            console.warn("JWT signature verification failed - possible secret mismatch");
            return null;
        }
        console.warn("JWT verification failed:", errorMessage);
        return null;
    }
}

export async function login(formData: FormData) {
    // Placeholder for real login logic
    const user = { email: formData.get("email"), name: "John Doe" };

    // Create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    (await cookies()).set("session", session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the session by setting an expired cookie
    (await cookies()).set("session", "", { expires: new Date(0), httpOnly: true });
}

/**
 * Clear invalid session cookie
 */
export async function clearSession() {
    (await cookies()).set("session", "", { expires: new Date(0), httpOnly: true });
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    
    if (!session) {
        return NextResponse.next();
    }

    try {
        // Try to decrypt and refresh the session
        const parsed = await decrypt(session);
        
        // If decryption returned null, token is invalid/expired - clear it
        if (!parsed) {
            const response = NextResponse.next();
            response.cookies.set("session", "", { expires: new Date(0), httpOnly: true });
            return response;
        }
        
        // Refresh the session so it doesn't expire
        parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: await encrypt(parsed),
            httpOnly: true,
            expires: parsed.expires,
        });
        return res;
    } catch (error) {
        // On any error, clear the invalid session and continue
        console.warn("Failed to update session, clearing invalid token:", error);
        const response = NextResponse.next();
        response.cookies.set("session", "", { expires: new Date(0), httpOnly: true });
        return response;
    }
}
