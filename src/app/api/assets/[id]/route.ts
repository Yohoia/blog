import { readPublishedAsset } from "@/lib/pagehush";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (
    process.env.BLOG_CONTENT_SOURCE !== "pagehush" ||
    !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id)
  )
    return new Response(null, { status: 404 });
  try {
    const asset = await readPublishedAsset(id.toLowerCase());
    if (!asset) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(asset.body), {
      headers: {
        "Content-Type": asset.type,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Image unavailable", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
