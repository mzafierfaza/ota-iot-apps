import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    
    console.log("--------------------------")
    console.log(req.nextUrl.pathname, "<<<< path0")
    if (!req.nextUrl.pathname.startsWith("/_next")) {
        console.log(req.nextUrl.pathname, "<<<< path1")

        // return NextResponse.redirect(
        //     new URL("/", req.nextUrl)
        // )

        console.log(req.nextUrl.pathname, "<<<< path2")
        const token = req.cookies.get("token")
        console.log(token, "<<<< token")
        console.log(req.nextUrl.pathname, "<<<< path")

        if (token && req.nextUrl.pathname === "/login") {
            console.log("harusnya gak masuk page login")
            return NextResponse.redirect(
                new URL("/", req.url).toString()
            )
        }
        
        if (!token && req.nextUrl.pathname !== "/login") {
            console.log("harusnya masuk page login")
            return NextResponse.redirect(
                new URL("/login", req.url).toString()
            )
        }
    }

    return NextResponse.next()

}

export const config = {
    matcher: [
        '/login',
        '/',
    ]
}
