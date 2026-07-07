import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const hasClerkConfig = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const isProduction = process.env.NODE_ENV === "production";

const clerkProxy = hasClerkConfig
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : null;

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (!clerkProxy) {
    if (isProduction && isProtectedRoute(req)) {
      return NextResponse.json({ error: "Clerk authentication is not configured." }, { status: 503 });
    }

    return NextResponse.next();
  }

  return clerkProxy(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
