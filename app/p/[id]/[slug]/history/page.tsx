import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getJSON, type HistoryEvent, type HistoryResponse, type ProductResponse, withContext } from "../../../../../lib/api";
import { when } from "../../../../../lib/labels";

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id, slug } = await params;
  const query = await searchParams;
  const product = await getJSON<ProductResponse>(`/api/v1/products/${encodeURIComponent(id)}`);
  if (!product.ok && product.status === 404) notFound();
  if (!product.ok) return <main className="wrap"><p className="error">The catalog is unavailable.</p></main>;
  if (slug !== product.data.product.slug) permanentRedirect(withContext(`/p/${id}/${product.data.product.slug}/history`, query));
  const history = await getJSON<HistoryResponse>(`/api/v1/products/${encodeURIComponent(id)}/history`);
  const item = product.data.product;
  const events = history.ok ? history.data.events : [];

  return (
    <main className="wrap">
      {product.data.demo && <p className="demo">Demo history. The line starts at the first sample observation and does not fill the gap.</p>}
      <p className="crumbs"><Link href={withContext(`/p/${id}/${slug}`, query)}>{item.mpn}</Link> / Price history</p>
      <h1>Price history</h1>
      <p className="mpn">{item.mpn}</p>
      <p>{item.manufacturer} · {item.title}</p>
      <nav className="tabs">
        <Link href={withContext(`/p/${id}/${slug}`, query)}>Offers</Link>
        <Link href={withContext(`/p/${id}/${slug}/history`, query)} aria-current="page">Price history</Link>
      </nav>
      {!history.ok && <p className="error">History could not be loaded.</p>}
      {history.ok && <p className="muted">{history.data.note}</p>}
      {events.length > 0 && <Chart events={events} />}
      {events.length === 0 && history.ok && <p>No stored observation yet.</p>}
      {events.length > 0 && (
        <table>
          <thead><tr><th>Observed</th><th>Seller</th><th>Kind</th><th>Amount</th><th>Gap before</th></tr></thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={`${event.offer_id}-${index}`}>
                <td>{when(event.observed_at)}</td>
                <td>{event.supplier}</td>
                <td>{event.kind === "correction" ? "Parser correction" : event.kind === "price_change" ? "Price change" : event.kind}</td>
                <td>{event.amount ? `${event.amount} ${event.currency}` : "No public price"}</td>
                <td>{event.gap_before ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

function Chart({ events }: { events: HistoryEvent[] }) {
  const priced = events.filter((event) => event.amount && Number(event.amount) > 0);
  if (priced.length === 0) return null;
  const times = priced.map((event) => new Date(event.observed_at).getTime());
  const amounts = priced.map((event) => Number(event.amount));
  const minT = Math.min(...times);
  const maxT = Math.max(...times);
  const minA = Math.min(...amounts);
  const maxA = Math.max(...amounts);
  const spanT = Math.max(1, maxT - minT);
  const spanA = Math.max(0.01, maxA - minA);
  const x = (time: number) => 40 + ((time - minT) / spanT) * 560;
  const y = (amount: number) => 180 - ((amount - minA) / spanA) * 140;
  const bySeller = new Map<string, HistoryEvent[]>();
  for (const event of priced) {
    const list = bySeller.get(event.supplier) || [];
    list.push(event);
    bySeller.set(event.supplier, list);
  }
  const colors = ["#2563eb", "#0f7a56", "#9a6700", "#9f2d2d"];
  const lines = [...bySeller.entries()].map(([seller, points], index) => {
    const segments: string[][] = [[]];
    for (const point of points) {
      if (point.gap_before && segments[segments.length - 1].length > 0) segments.push([]);
      const cx = x(new Date(point.observed_at).getTime());
      const cy = y(Number(point.amount));
      segments[segments.length - 1].push(`${cx},${cy}`);
    }
    return { seller, color: colors[index % colors.length], segments };
  });
  return (
    <svg className="chart" viewBox="0 0 640 220" role="img" aria-label="Observed prices with gaps left open">
      {lines.map((line) => line.segments.map((segment, index) => (
        <polyline key={`${line.seller}-${index}`} fill="none" stroke={line.color} strokeWidth="2" points={segment.join(" ")} />
      )))}
      {lines.map((line) => (
        <text key={line.seller} x="40" y={20 + lines.indexOf(line) * 16} fill={line.color} fontSize="12">{line.seller}</text>
      ))}
    </svg>
  );
}
