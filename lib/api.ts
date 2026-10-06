const base = () => process.env.PARTOVIO_API_BASE || "http://127.0.0.1:8080";

export type SearchHit = {
  product_id: string;
  slug: string;
  manufacturer: string;
  mpn: string;
  title: string;
  category: string;
  match_type: string;
  offer_count: number;
};

export type SearchResponse = {
  demo?: boolean;
  query: string;
  partial: boolean;
  degraded?: boolean;
  search_mode?: string;
  groups: Record<string, SearchHit[]>;
  group_order: string[];
};

export type ProductResponse = {
  demo?: boolean;
  product: {
    product_id: string;
    slug: string;
    manufacturer: string;
    mpn: string;
    title: string;
    category: string;
    category_id: string;
    lifecycle: string;
    gtin: string;
    description?: string;
  };
  sources?: string[];
  reference?: { text: string; missing?: string[]; model?: string; generated_at?: string };
};

export type CoverageSource = { name: string; role: string; enabled: boolean };
export type CoverageBudget = { enabled: boolean; daily_limit: number; connected?: boolean };
export type Coverage = {
  parse: CoverageSource[];
  discover: CoverageSource[];
  sly: CoverageBudget;
  codex: CoverageBudget;
  images: CoverageBudget;
};

export type Money = { status: string; currency?: string; amount?: string; per?: string };

export type Offer = {
  offer_id: string;
  supplier_id: string;
  supplier: string;
  supplier_type: string;
  supplier_sku: string;
  ship_from: string;
  requested_country: string;
  country_confirmed: boolean;
  sales_unit: string;
  base_per_sales: string;
  moq: string;
  increment: string;
  sales_units: string;
  base_units: string;
  stock_state: string;
  unit_price: Money;
  goods: Money;
  shipping: Money;
  comparable: boolean;
  observed_at: string;
  destination: string;
  image_url?: string;
};

export type OffersResponse = {
  demo?: boolean;
  offers: Offer[];
  comparable_offer_ids: string[];
  incomplete_offer_ids: string[];
  currency_note: string;
};

export type HistoryEvent = {
  offer_id: string;
  supplier: string;
  kind: string;
  currency: string;
  amount: string;
  observed_at: string;
  gap_before: boolean;
};

export type HistoryResponse = { demo?: boolean; events: HistoryEvent[]; note: string };

export type Category = { id: string; name: string; count: number };
export type ProductLink = {
  product_id: string;
  slug: string;
  manufacturer: string;
  mpn: string;
  title: string;
  path: string;
};
export type Brand = { id: string; name: string; count: number };
export type SitemapURL = { path: string; lastmod: string };

export async function getJSON<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  try {
    const response = await fetch(new URL(path, base()), {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return { ok: false, status: response.status };
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 0 };
  }
}

export function withContext(path: string, current: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const key of ["country", "currency", "quantity"]) {
    const value = current[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
