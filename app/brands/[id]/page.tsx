import Link from "next/link";
import { notFound } from "next/navigation";
import { getJSON, type Brand, type ProductLink } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brands = await getJSON<{ brands: Brand[] }>("/api/v1/brands");
  if (!brands.ok) return <main className="wrap"><p className="error">The catalog is unavailable.</p></main>;
  const brand = brands.data.brands.find((item) => item.id === id);
  if (!brand) notFound();
  const listed = await getJSON<{ products: ProductLink[] }>(`/api/v1/brands/${encodeURIComponent(id)}/products?limit=50`);
  const products = listed.ok ? listed.data.products : [];
  return (
    <main className="wrap">
      <p className="crumbs"><Link href="/brands">Brands</Link> / {brand.name}</p>
      <h1>{brand.name}</h1>
      <p>{brand.count} published {brand.count === 1 ? "product" : "products"}.</p>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <Link href={product.path}>{product.mpn}</Link>
            {product.title ? <span className="muted"> · {product.title}</span> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
