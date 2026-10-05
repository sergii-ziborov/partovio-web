import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ offerID: string }> }) {
  const { offerID } = await context.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(offerID)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const base = process.env.PARTOVIO_API_BASE || "http://127.0.0.1:8080";
  try {
    const response = await fetch(new URL(`/out/${offerID}`, base), { redirect: "manual", cache: "no-store" });
    const location = response.headers.get("location");
    if (response.status === 302 && location && location.startsWith("https://")) {
      return NextResponse.redirect(location, 302);
    }
  } catch {
    return NextResponse.json({ error: "source_unavailable" }, { status: 503 });
  }
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}
