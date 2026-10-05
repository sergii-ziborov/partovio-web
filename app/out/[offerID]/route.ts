import { NextResponse } from "next/server";
import { notFoundHtml } from "../../../lib/not-found-html";

export const dynamic = "force-dynamic";

function notFoundPage() {
  return new NextResponse(notFoundHtml(), {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export async function GET(_request: Request, context: { params: Promise<{ offerID: string }> }) {
  const { offerID } = await context.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(offerID)) return notFoundPage();
  const base = process.env.PARTOVIO_API_BASE || "http://127.0.0.1:8080";
  try {
    const response = await fetch(new URL(`/out/${offerID}`, base), {
      redirect: "manual",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const location = response.headers.get("location");
    if (response.status === 302 && location && location.startsWith("https://")) {
      return NextResponse.redirect(location, 302);
    }
    if (response.status >= 500) return NextResponse.json({ error: "source_unavailable" }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "source_unavailable" }, { status: 503 });
  }
  return notFoundPage();
}
