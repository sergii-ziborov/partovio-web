export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="wrap article">
      <h1>Privacy</h1>
      <p>Search does not require an account. Destination country and currency stay in the page address so a shared cache does not mix one visitor’s context into another visitor’s page.</p>
      <p>Part numbers sent to search are catalog queries. They are not added to public metrics. High-cardinality query text is not a Prometheus label.</p>
      <p>This page will be replaced with the operator’s privacy notice before a public launch. It is not a finished legal policy.</p>
    </main>
  );
}
