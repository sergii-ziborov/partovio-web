export type Post = { slug: string; title: string; date: string; summary: string; body: string[] };

export const posts: Post[] = [
  {
    slug: "how-to-read-an-offer",
    title: "How to read an offer on Partovio",
    date: "2026-10-04",
    summary: "A unit price, a pack, and a shipping line are three different facts.",
    body: [
      "The seller name is the organisation behind that row. A second regional storefront of the same organisation is not a second independent source.",
      "The order column shows the quantity you would actually buy. If the seller ships packs of five, two pieces still means one pack. The goods total uses that pack, not two times the pack price.",
      "Delivery stays blank when the source did not confirm it. A blank delivery is not free, and it is not used to sort that row as the cheapest complete offer.",
    ],
  },
  {
    slug: "why-price-history-has-gaps",
    title: "Why a price history has gaps",
    date: "2026-10-04",
    summary: "Partovio draws a point when it observed a price. It does not invent the days in between.",
    body: [
      "History starts at the first observation Partovio stored for that offer. A chart in a design mock is not a record of last spring.",
      "If two observations are far apart, the line breaks. The break means we did not see the price in the middle. It does not mean the price stayed flat.",
      "A parser correction is labelled as a correction. Fixing a misread comma is not a market crash.",
    ],
  },
];

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
