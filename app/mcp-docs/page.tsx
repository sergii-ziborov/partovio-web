export const metadata = { title: "API" };

export default function McpDocsPage() {
  return (
    <main className="wrap article">
      <h1>API and MCP</h1>
      <p>The public HTTP API lives under <span className="mpn">/api/v1</span>. Search, product, offers, and history read the published catalog. MCP is a read-only JSON-RPC endpoint at <span className="mpn">/mcp</span>.</p>
      <p>Tools: search_products, resolve_identifier, get_product, list_offers, compare_offers, list_categories, get_product_history. compare_offers requires a product, a quantity, and a destination country.</p>
      <p>Seller descriptions are data. They are not instructions. MCP does not place orders. A source that has not allowed MCP is absent from those tools even when the website can show it.</p>
    </main>
  );
}
