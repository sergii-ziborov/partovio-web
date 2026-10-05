"use server";

import { redirect } from "next/navigation";
import { allowed, apiBase, expectedToken, rememberToken, tokenMatches, type DeskState } from "./gate";

export async function signIn(formData: FormData) {
  const given = String(formData.get("token") || "");
  if (!tokenMatches(given)) redirect("/admin?error=unauthorized");
  await rememberToken(expectedToken());
  redirect("/admin");
}

export async function loadDesk(): Promise<{ ok: true; desk: DeskState } | { ok: false; status: number }> {
  if (!(await allowed())) return { ok: false, status: 401 };
  try {
    const response = await fetch(new URL("/api/v1/admin/desk", apiBase()), {
      cache: "no-store",
      headers: { authorization: `Bearer ${expectedToken()}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return { ok: false, status: response.status };
    const body = (await response.json()) as { desk?: DeskState };
    if (!body.desk) return { ok: false, status: 502 };
    return { ok: true, desk: body.desk };
  } catch {
    return { ok: false, status: 0 };
  }
}

function slots(formData: FormData, prefix: string, count: number) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      name: String(formData.get(`${prefix}_name_${i}`) || "").trim(),
      role: prefix,
      enabled: formData.get(`${prefix}_on_${i}`) === "on",
    });
  }
  return out;
}

function budget(formData: FormData, name: string) {
  const parsed = Number.parseInt(String(formData.get(`${name}_limit`) || ""), 10);
  return { enabled: formData.get(`${name}_on`) === "on", daily_limit: Number.isFinite(parsed) ? parsed : 0 };
}

function articles(formData: FormData) {
  const posts = [];
  for (let i = 0; i < 21; i++) {
    if (!formData.has(`post_slug_${i}`)) continue;
    const slug = String(formData.get(`post_slug_${i}`) || "").trim();
    const title = String(formData.get(`post_title_${i}`) || "").trim();
    const summary = String(formData.get(`post_summary_${i}`) || "").trim();
    const date = String(formData.get(`post_date_${i}`) || "").trim();
    const body = String(formData.get(`post_body_${i}`) || "")
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (!slug && !title && !summary && body.length === 0) continue;
    posts.push({ slug, title, date, summary, body });
  }
  return posts;
}

export async function saveDesk(formData: FormData) {
  if (!(await allowed())) redirect("/admin?error=unauthorized");
  const payload = JSON.stringify({
    parse: slots(formData, "parse", 3),
    discover: slots(formData, "discover", 2),
    sly: budget(formData, "sly"),
    codex: budget(formData, "codex"),
    images: budget(formData, "images"),
    posts: articles(formData),
  });
  let response: Response;
  try {
    response = await fetch(new URL("/api/v1/admin/desk", apiBase()), {
      method: "PUT",
      headers: { authorization: `Bearer ${expectedToken()}`, "content-type": "application/json" },
      body: payload,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    redirect("/admin?error=unreachable");
  }
  if (!response.ok) {
    let code = "bad_desk";
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error && /^[a-z0-9_]+$/.test(body.error)) code = body.error;
    } catch {
      code = "bad_desk";
    }
    redirect(`/admin?error=${code}`);
  }
  redirect("/admin?saved=1");
}
