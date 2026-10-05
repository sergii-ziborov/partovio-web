import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CopyButton } from "../../../../components/copy-button";
import { getJSON, type OffersResponse, type ProductResponse, withContext } from "../../../../lib/api";
import { moneyText, stockLabel, when } from "../../../../lib/labels";

export const dynamic = "force-dynamic";

export default async function ProductPage({
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
  if (!product.ok) return <main className="wrap"><p className="error">The product page cannot reach the catalog.</p></main>;
  if (slug !== product.data.product.slug) permanentRedirect(withContext(`/p/${id}/${product.data.product.slug}`, query));
  const quantity = query.quantity || "";
  const offers = await getJSON<OffersResponse>(`/api/v1/products/${encodeURIComponent(id)}/offers?quantity=${encodeURIComponent(quantity)}&country=${encodeURIComponent(query.country || "")}`);
  const item = product.data.product;
  const rows = offers.ok ? offers.data.offers : [];

  return (
    <main className="wrap">
      {(product.data.demo || offers.ok && offers.data.demo) && <p className="demo">Demo catalog. Prices are sample observations, not a live market.</p>}
      <p className="crumbs"><Link href="/">Home</Link> / <Link href="/catalog">Catalog</Link> / {item.category || "Part"}</p>
      <div className="product-top">
        <section className="panel">
          <div className="row-actions">
            <h1 className="mpn">{item.mpn}</h1>
            <CopyButton value={item.mpn} />
          </div>
          <p>{item.manufacturer}</p>
          <p className="muted">{item.title}</p>
          <dl className="kvs">
            <dt>Lifecycle</dt><dd>{item.lifecycle || "Unknown"}</dd>
            <dt>Category</dt><dd>{item.category || "Uncategorised"}</dd>
            {item.gtin && <><dt>GTIN</dt><dd className="mpn">{item.gtin}</dd></>}
          </dl>
        </section>
        <section className="panel">
          <h2>This comparison</h2>
          <p className="muted">Offers found in connected sources. This is not every seller in the world.</p>
          <form action={`/p/${id}/${slug}`} method="get" className="controls">
            {query.country && <input type="hidden" name="country" value={query.country} />}
            {query.currency && <input type="hidden" name="currency" value={query.currency} />}
            <label>Quantity <input name="quantity" defaultValue={quantity} inputMode="decimal" /></label>
            <button className="primary" type="submit">Update</button>
          </form>
        </section>
      </div>
      <nav className="tabs" aria-label="Product sections">
        <Link href={withContext(`/p/${id}/${slug}`, query)} aria-current="page">Offers</Link>
        <Link href={withContext(`/p/${id}/${slug}/history`, query)}>Price history</Link>
      </nav>
      {!offers.ok && <p className="error">Offers could not be loaded. The product record is still shown.</p>}
      {offers.ok && rows.length === 0 && <p>No public offer is published for this part right now. The reference card stays available.</p>}
      <Offers rows={rows} />
      {offers.ok && <p className="muted">{offers.data.currency_note}</p>}
    </main>
  );
}

function Offers({ rows }: { rows: OffersResponse["offers"] }) {
  if (rows.length === 0) return null;
  return (
    <>
      <table className="desk">
        <thead>
          <tr>
            <th>Seller</th><th>Availability</th><th>Order</th><th>Price</th><th>Delivery</th><th>Observed</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((offer) => (
            <tr key={offer.offer_id}>
              <td>{offer.supplier}<div className="muted">{offer.supplier_type}</div></td>
              <td className={`stock ${offer.stock_state}`}>{stockLabel[offer.stock_state] || offer.stock_state}</td>
              <td>{offer.sales_units} {offer.sales_unit} · covers {offer.base_units}<div className="muted">MOQ {offer.moq}, step {offer.increment}</div></td>
              <td>{moneyText(offer.goods.status, offer.goods.currency, offer.goods.amount)}<div className="muted">{moneyText(offer.unit_price.status, offer.unit_price.currency, offer.unit_price.amount, offer.unit_price.per)}</div></td>
              <td>{offer.shipping.status === "quoted" ? moneyText("quoted", offer.shipping.currency, offer.shipping.amount) : "Delivery not confirmed"}<div className="muted">{offer.ship_from ? `Ships from ${offer.ship_from}` : "Origin unknown"}{offer.country_confirmed ? "" : " · destination not confirmed"}</div></td>
              <td>{when(offer.observed_at)}</td>
              <td><a className="primary" href={offer.destination}>View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cards">
        {rows.map((offer) => (
          <article className="offer-card" key={offer.offer_id}>
            <strong>{offer.supplier}</strong>
            <div className={`stock ${offer.stock_state}`}>{stockLabel[offer.stock_state] || offer.stock_state}</div>
            <div>{moneyText(offer.goods.status, offer.goods.currency, offer.goods.amount)}</div>
            <div className="muted">{offer.shipping.status === "quoted" ? moneyText("quoted", offer.shipping.currency, offer.shipping.amount) : "Delivery not confirmed"}</div>
            <a className="primary" href={offer.destination}>View</a>
          </article>
        ))}
      </div>
    </>
  );
}
