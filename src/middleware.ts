import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "~/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/dashboard/chats", request.url));
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};