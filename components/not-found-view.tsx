import Link from "next/link";

export function NotFoundView() {
  return (
    <main className="wrap">
      <h1>Not found</h1>
      <p>This address is not a published page.</p>
      <p><Link href="/">Back to search</Link></p>
    </main>
  );
}
