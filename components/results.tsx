import Link from "next/link";
import type { SearchResponse } from "../lib/api";
import { withContext } from "../lib/api";
import { matchLabel } from "../lib/labels";

export function Results({
  result,
  params,
}: {
  result: { ok: true; data: SearchResponse } | { ok: false; status: number } | null;
  params: Record<string, string | undefined>;
}) {
  if (!result) return null;
  if (!result.ok) return <p className="error">Search is unavailable right now. The catalog was not replaced with an empty result.</p>;
  return (
    <section className="groups">
      {result.data.demo && <p className="demo">Demo catalog. These sellers are sample data, not live distributor feeds.</p>}
      {result.data.degraded && <p className="muted">The search index is not answering. These matches still come from the catalog held in this process.</p>}
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
  );
}
