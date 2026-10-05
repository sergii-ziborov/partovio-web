import Link from "next/link";
import { SearchForm } from "../components/site-frame";

export default function HomePage() {
  return (
    <main className="wrap home">
      <h1>Partovio</h1>
      <p className="lede">Find the part. Compare the options.</p>
      <SearchForm large />
      <div className="hints">
        <span className="muted">Try</span>
        <Link href="/search?q=A1-25370">A1-25370</Link>
        <Link href="/search?q=AI25370">AI25370</Link>
        <Link href="/search?q=HL-9-HOOD">HL-9-HOOD</Link>
      </div>
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
    </main>
  );
}
