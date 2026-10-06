import type { Metadata } from "next";
import Link from "next/link";
import { Results } from "../components/results";
import { SearchForm } from "../components/site-frame";
import { getJSON, type SearchResponse } from "../lib/api";

export const dynamic = "force-dynamic";

const brand = process.env.PARTOVIO_BRAND || "Partovio";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  if ((params.q || "").trim()) return { title: brand, robots: { index: false, follow: false } };
  return { title: brand };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const demo = process.env.PARTOVIO_DEMO === "1";
  const result = q
    ? await getJSON<SearchResponse>(`/api/v1/search?q=${encodeURIComponent(q)}&manufacturer=${encodeURIComponent(params.manufacturer || "")}&category=${encodeURIComponent(params.category || "")}`)
    : null;

  return (
    <main className={q ? "wrap home has-query" : "wrap home"}>
      <h1>{brand}</h1>
      <p className="lede">Find the part. Compare the options.</p>
      <SearchForm large initial={q} category={params.category || ""} manufacturer={params.manufacturer || ""} country={params.country || ""} currency={params.currency || ""} />
      {demo && (
        <div className="hints">
          <span className="muted">Try</span>
          <Link href="/?q=A1-25370">A1-25370</Link>
          <Link href="/?q=AI25370">AI25370</Link>
          <Link href="/?q=HL-9-HOOD">HL-9-HOOD</Link>
        </div>
      )}
      {params.category && <p className="muted">The next search stays inside {params.category}.</p>}
      {q ? <div className="results"><Results result={result} params={params} /></div> : (
        <section className="points">
          <article>
            <h2>Connected sellers</h2>
            <p>Offers come from sources that have been allowed in. Coverage is counted, not implied.</p>
          </article>
          <article>
            <h2>Packs and minimums</h2>
            <p>A pack of five is not the same order as two loose pieces. The total follows the seller rule.</p>
          </article>
          <article>
            <h2>Destination stays explicit</h2>
            <p>Choosing a country does not invent a warehouse or a shipping price.</p>
          </article>
        </section>
      )}
    </main>
  );
}
