export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="wrap article">
      <h1>About Partovio</h1>
      <p>Partovio is a search page for technical parts. You enter a manufacturer part number, a seller code, or a short name, then compare the offers Partovio is allowed to show.</p>
      <p>There is no Partovio warehouse, checkout, or payment. The view button leaves for the seller.</p>
      <p>The brand name and the public address come from configuration. A domain is not treated as registered until it actually is.</p>
    </main>
  );
}
