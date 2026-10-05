import type { MetadataRoute } from "next";
import { getJSON, type Category } from "../lib/api";
import { posts } from "../lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.PARTOVIO_PUBLIC_ORIGIN;
  if (!origin || process.env.PARTOVIO_DEMO === "1") return [];
  const now = new Date();
  const staticPaths = ["", "/catalog", "/blog", "/about", "/methodology", "/privacy", "/terms", "/contact", "/suppliers", "/mcp-docs", "/brands"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: origin + path, lastModified: now }));
  for (const post of posts) entries.push({ url: `${origin}/blog/${post.slug}`, lastModified: now });
  const categories = await getJSON<{ categories: Category[] }>("/api/v1/categories");
  if (categories.ok) {
    for (const category of categories.data.categories) {
      entries.push({ url: `${origin}/catalog/${category.id}`, lastModified: now });
    }
  }
  return entries;
}
