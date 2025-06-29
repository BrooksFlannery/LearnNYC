import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/", // Home page
        "/api/characters", "/api/characters/:path*", // Character data & chat
        "/api/trpc/:path*", // All tRPC endpoints (game state)
    ],
};