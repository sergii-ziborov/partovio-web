import type { MetadataRoute } from "next";
import { getJSON, type Brand, type Category, type SitemapURL } from "../lib/api";
import { loadPosts } from "../lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.PARTOVIO_PUBLIC_ORIGIN;
  if (!origin || process.env.PARTOVIO_DEMO === "1") return [];
  const staticPaths = ["", "/catalog", "/blog", "/about", "/methodology", "/privacy", "/terms", "/contact", "/suppliers", "/mcp-docs", "/brands"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: origin + path }));
  for (const post of await loadPosts()) {
    const dated = post.date ? new Date(post.date) : undefined;
    entries.push({ url: `${origin}/blog/${post.slug}`, lastModified: dated && !Number.isNaN(dated.getTime()) ? dated : undefined });
  }
  const categories = await getJSON<{ categories: Category[] }>("/api/v1/categories");
  if (categories.ok) {
    for (const category of categories.data.categories) entries.push({ url: `${origin}/catalog/${category.id}` });
  }
  const brands = await getJSON<{ brands: Brand[] }>("/api/v1/brands");
  if (brands.ok) {
    for (const brand of brands.data.brands) entries.push({ url: `${origin}/brands/${brand.id}` });
  }
  const products = await getJSON<{ urls: SitemapURL[] }>("/api/v1/sitemap/products");
  if (products.ok) {
    for (const item of products.data.urls) {
      const dated = item.lastmod ? new Date(item.lastmod) : undefined;
      entries.push({ url: origin + item.path, lastModified: dated && !Number.isNaN(dated.getTime()) ? dated : undefined });
    }
  }
  return entries;
}
