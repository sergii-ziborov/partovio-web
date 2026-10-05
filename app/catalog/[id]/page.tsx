import Link from "next/link";
import { notFound } from "next/navigation";
import { getJSON, type Category } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getJSON<{ category: Category }>(`/api/v1/categories/${encodeURIComponent(id)}`);
  if (!result.ok && result.status === 404) notFound();
  if (!result.ok) return <main className="wrap"><p className="error">The catalog is unavailable.</p></main>;
  return (
    <main className="wrap">
      <p className="crumbs"><Link href="/catalog">Categories</Link> / {result.data.category.name}</p>
      <h1>{result.data.category.name}</h1>
      <p>{result.data.category.count} published {result.data.category.count === 1 ? "product" : "products"}.</p>
      <p className="muted">Open search and filter by this category name when you already know the part family.</p>
      <p><Link href={`/search?category=${encodeURIComponent(result.data.category.name)}`}>Search inside {result.data.category.name}</Link></p>
    </main>
  );
}
