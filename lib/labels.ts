export const matchLabel: Record<string, string> = {
  exact_mpn: "Exact match",
  exact_sku: "Supplier part number",
  alias: "Confirmed alias",
  prefix: "Starts with",
  typo: "Possible correction",
  text: "Similar description",
};

export const stockLabel: Record<string, string> = {
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  backorder: "On order",
  preorder: "Preorder",
  unknown: "Availability not confirmed",
  stale: "Last observed earlier",
  withdrawn: "Withdrawn",
};

export function moneyText(status: string, currency?: string, amount?: string, per?: string): string {
  if (status !== "quoted" || !amount || !currency) return "Price on request";
  const suffix = per ? ` / ${per}` : "";
  return `${amount} ${currency}${suffix}`;
}

export function when(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
