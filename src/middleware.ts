import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log(request.nextUrl);
    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard/chats", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/",
};