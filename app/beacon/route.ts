import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const base = process.env.PARTOVIO_API_BASE || "http://127.0.0.1:8080";
  const body = await request.text();
  try {
    const response = await fetch(new URL("/api/v1/views", base), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    });
    return new NextResponse(null, { status: response.ok ? 204 : response.status });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
