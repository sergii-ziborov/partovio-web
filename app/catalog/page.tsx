import Link from "next/link";
import { getJSON, type Category } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const result = await getJSON<{ demo?: boolean; categories: Category[] }>("/api/v1/categories");
  return (
    <main className="wrap">
      <h1>Categories</h1>
      <p className="muted">Only categories with a published product are listed.</p>
      {!result.ok && <p className="error">The catalog is unavailable.</p>}
      {result.ok && result.data.demo && <p className="demo">Demo catalog.</p>}
      {result.ok && (
        <div className="card">
          {result.data.categories.length === 0 && <p>No published category yet.</p>}
          {result.data.categories.map((category) => (
            <Link className="hit" key={category.id} href={`/catalog/${category.id}`}>
              <span>{category.name}</span>
              <span className="muted">{category.count}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
