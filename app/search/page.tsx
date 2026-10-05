import Link from "next/link";
import { SearchForm } from "../../components/site-frame";
import { getJSON, type SearchResponse, withContext } from "../../lib/api";
import { matchLabel } from "../../lib/labels";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const result = q ? await getJSON<SearchResponse>(`/api/v1/search?q=${encodeURIComponent(q)}&manufacturer=${encodeURIComponent(params.manufacturer || "")}&category=${encodeURIComponent(params.category || "")}`) : null;

  return (
    <main className="wrap">
      <SearchForm initial={q} />
      {!q && <p className="muted">Enter a part number or a short description.</p>}
      {result && !result.ok && <p className="error">Search is unavailable right now. The catalog was not replaced with an empty result.</p>}
      {result && result.ok && result.data.demo && <p className="demo">Demo catalog. These sellers are sample data, not live distributor feeds.</p>}
      {result && result.ok && (
        <section className="groups">
          <p className="muted">Query kept as entered: <span className="mpn">{result.data.query}</span></p>
          {result.data.group_order.length === 0 && <p>No published product matched this query.</p>}
          {result.data.group_order.map((group) => (
            <div className="group" key={group}>
              <h2>{matchLabel[group] || group}</h2>
              <div className="card">
                {result.data.groups[group]?.map((hit) => (
                  <Link className="hit" key={hit.product_id} href={withContext(`/p/${hit.product_id}/${hit.slug}`, params)}>
                    <span>
                      <span className="mpn">{hit.mpn}</span>
                      <span className={`badge ${group === "typo" ? "typo" : ""}`}>{matchLabel[group]}</span>
                      <div>{hit.manufacturer}</div>
                      <div className="muted">{hit.title}</div>
                    </span>
                    <span className="muted">{hit.offer_count} {hit.offer_count === 1 ? "offer" : "offers"}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {result.data.partial && <p className="muted">Extended matching was cut short. Exact results above are complete for this page.</p>}
        </section>
      )}
    </main>
  );
}
