import Link from "next/link";
import { notFound } from "next/navigation";
import { getJSON, type Category, type ProductLink } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const cursor = query.cursor || "0";
  const result = await getJSON<{ category: Category }>(`/api/v1/categories/${encodeURIComponent(id)}`);
  if (!result.ok && result.status === 404) notFound();
  if (!result.ok) return <main className="wrap"><p className="error">The catalog is unavailable.</p></main>;
  const listed = await getJSON<{ products: ProductLink[] }>(`/api/v1/categories/${encodeURIComponent(id)}/products?limit=50&cursor=${encodeURIComponent(cursor)}`);
  const products = listed.ok ? listed.data.products : [];
  const offset = Number.parseInt(cursor, 10) || 0;
  return (
    <main className="wrap">
      <p className="crumbs"><Link href="/catalog">Categories</Link> / {result.data.category.name}</p>
      <h1>{result.data.category.name}</h1>
      <p>{result.data.category.count} published {result.data.category.count === 1 ? "product" : "products"}.</p>
      {products.length === 0 && <p>No published product is listed in this category.</p>}
      {products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.product_id}>
              <Link href={product.path}>{product.manufacturer} {product.mpn}</Link>
              {product.title ? <span className="muted"> · {product.title}</span> : null}
            </li>
          ))}
        </ul>
      )}
      {products.length === 50 && <p><Link href={`/catalog/${id}?cursor=${offset + 50}`}>Next products</Link></p>}
    </main>
  );
}
