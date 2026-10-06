import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type DeskSource = { name: string; role: string; enabled: boolean; type?: string; feed_path?: string; status?: string };
export type DeskBudget = { enabled: boolean; daily_limit: number; used_today: number; connected: boolean; hard_stop?: boolean };
export type DeskPost = { slug: string; title: string; date: string; summary: string; body: string[]; status?: string; author?: string };
export type DeskView = { path: string; count: number };
export type DeskState = {
  parse: DeskSource[];
  discover: DeskSource[];
  sly: DeskBudget;
  codex: DeskBudget;
  images: DeskBudget;
  posts: DeskPost[];
  views: DeskView[] | null;
};

const cookieName = "partovio_admin";

export function apiBase() {
  return process.env.PARTOVIO_API_BASE || "http://127.0.0.1:8080";
}

export function expectedToken() {
  const set = process.env.PARTOVIO_ADMIN_TOKEN || "";
  if (set) return set;
  if (process.env.PARTOVIO_DEMO === "1") return "demo";
  return "";
}

export function adminGate(): "open" | "sign-in" | "missing" {
  if (process.env.PARTOVIO_ADMIN_TOKEN) return "sign-in";
  if (process.env.PARTOVIO_DEMO === "1") return "open";
  return "missing";
}

function same(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function seal(token: string) {
  return createHmac("sha256", token).update("partovio-admin").digest("hex");
}

export async function allowed() {
  const token = expectedToken();
  if (!token) return false;
  if (adminGate() === "open") return true;
  const jar = await cookies();
  return same(jar.get(cookieName)?.value || "", seal(token));
}

export async function rememberToken(token: string) {
  const jar = await cookies();
  jar.set(cookieName, seal(token), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
}

export function tokenMatches(given: string) {
  const token = expectedToken();
  return Boolean(token) && same(given, token);
}
