import { NextRequest, NextResponse } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Define route patterns
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isProtectedPage = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/quiz') ||
        pathname.startsWith('/results') ||
        pathname.startsWith('/admin');

    // Validate session if it exists - clear invalid/expired tokens
    let hasValidSession = false;
    if (sessionCookie) {
        try {
            const session = await decrypt(sessionCookie);
            hasValidSession = !!session;
            
            // If session is invalid/expired, clear the cookie
            if (!session) {
                const response = NextResponse.next();
                response.cookies.set('session', '', { expires: new Date(0), httpOnly: true });
                
                // If on protected page, redirect to login
                if (isProtectedPage) {
                    return NextResponse.redirect(new URL('/login', request.url));
                }
                
                return response;
            }
        } catch (error) {
            // On any error, treat as invalid session
            console.warn('Middleware: session validation failed');
            hasValidSession = false;
            
            const response = NextResponse.next();
            response.cookies.set('session', '', { expires: new Date(0), httpOnly: true });
            
            if (isProtectedPage) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            
            return response;
        }
    }

    // 1. Redirect unauthenticated users from protected pages
    if (isProtectedPage && !hasValidSession) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect authenticated users away from auth pages
    if (isAuthPage && hasValidSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. Update session (refresh cookie) and proceed
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
