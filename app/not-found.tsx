import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <h1>Not found</h1>
      <p>This address is not a published page.</p>
      <p><Link href="/">Back to search</Link></p>
    </main>
  );
}
