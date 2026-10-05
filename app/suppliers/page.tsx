export const metadata = { title: "For suppliers" };

export default function SuppliersPage() {
  return (
    <main className="wrap article">
      <h1>For suppliers</h1>
      <p>Partovio fills the catalog from allowed feeds. A person does not type each product, price, and stock row by hand.</p>
      <p>Connecting a source is a decision about rights: what may be stored, shown on the site, returned by the API, exposed to MCP, and kept as history. Permission to show a price on the site is not permission to resell the feed.</p>
      <p>There is no upload form on this page. Keys and feed URLs belong in the server configuration, not in the browser.</p>
    </main>
  );
}
