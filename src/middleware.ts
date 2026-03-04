import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Define route patterns
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isProtectedPage = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/quiz') ||
        pathname.startsWith('/results') ||
        pathname.startsWith('/admin');

    // 1. Redirect unauthenticated users from protected pages
    if (isProtectedPage && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect authenticated users away from auth pages
    if (isAuthPage && session) {
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
