import Link from "next/link";
import { getJSON, type Brand } from "../../lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brands" };

export default async function BrandsPage() {
  const result = await getJSON<{ brands: Brand[] }>("/api/v1/brands");
  const brands = result.ok ? result.data.brands : [];
  return (
    <main className="wrap article">
      <h1>Brands</h1>
      <p>These manufacturers already have a published product. An empty brand is not given a URL.</p>
      {!result.ok && <p className="error">The catalog is unavailable.</p>}
      {result.ok && brands.length === 0 && <p>No manufacturer has a public offer yet.</p>}
      {brands.length > 0 && (
        <ul>
          {brands.map((brand) => (
            <li key={brand.id}><Link href={`/brands/${brand.id}`}>{brand.name}</Link> <span className="muted">({brand.count})</span></li>
          ))}
        </ul>
      )}
    </main>
  );
}
