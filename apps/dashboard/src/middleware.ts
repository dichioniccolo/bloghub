export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */

    "/((?!api/|_next/|login|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
