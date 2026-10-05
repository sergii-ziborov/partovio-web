import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["q", "manufacturer", "category", "country", "currency", "quantity"]) {
    const value = params[key];
    if (value) query.set(key, value);
  }
  const text = query.toString();
  redirect(text ? `/?${text}` : "/");
}
