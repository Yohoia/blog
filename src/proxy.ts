import { NextRequest, NextResponse } from "next/server";
import { getBlogEntry } from "@/lib/content";
/** Resolve missing articles before rendering so their HTTP 404 includes the complete no-JS page. */
export async function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^(\/en)?\/blog\/(.+?)\/?$/);
  if (!match) return NextResponse.next();
  let id: string;
  try {
    id = decodeURIComponent(match[2]);
  } catch {
    return rewriteError(404);
  }
  try {
    const canonicalId =
      process.env.BLOG_CONTENT_SOURCE === "pagehush"
        ? await (await import("@/lib/pagehush")).resolvePublishedArticleId(id)
        : (await getBlogEntry(id))?.id;
    if (!canonicalId) return rewriteError(404);
    if (canonicalId !== id) {
      const url = request.nextUrl.clone();
      url.pathname = `${match[1] ?? ""}/blog/${canonicalId}`;
      const response = NextResponse.redirect(url, 308);
      // Re-check publication if an old link is visited again after withdrawal.
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    return NextResponse.next();
  } catch {
    return rewriteError(500);
  }
  function rewriteError(code: 404 | 500) {
    const url = request.nextUrl.clone();
    url.pathname = `/${code}`;
    const headers = new Headers(request.headers);
    headers.set("x-error-locale", match?.[1] ? "en" : "zh");
    return NextResponse.rewrite(url, { status: code, request: { headers } });
  }
}
export const config = { matcher: ["/blog/:path*", "/en/blog/:path*"] };
