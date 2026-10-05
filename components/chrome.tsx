"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const countries = [
  ["", "Ship to"],
  ["US", "United States"],
  ["DE", "Germany"],
  ["NL", "Netherlands"],
  ["IL", "Israel"],
  ["GB", "United Kingdom"],
];

const currencies = [
  ["", "Currency"],
  ["USD", "USD"],
  ["EUR", "EUR"],
  ["ILS", "ILS"],
];

export function ContextControls() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="controls">
      <label>
        <span className="skip">Destination country</span>
        <select value={params.get("country") ?? ""} onChange={(event) => set("country", event.target.value)}>
          {countries.map(([value, label]) => <option key={value || "none"} value={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span className="skip">Display currency</span>
        <select value={params.get("currency") ?? ""} onChange={(event) => set("currency", event.target.value)}>
          {currencies.map(([value, label]) => <option key={value || "none"} value={value}>{label}</option>)}
        </select>
      </label>
    </div>
  );
}
