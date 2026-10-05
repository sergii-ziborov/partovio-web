import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";
import { ViewBeacon } from "../components/view-beacon";
import { Footer, Header } from "../components/site-frame";
import "./globals.css";

const sans = Source_Sans_3({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-mono" });

const brand = process.env.PARTOVIO_BRAND || "Partovio";

export const metadata: Metadata = {
  title: { default: brand, template: `%s · ${brand}` },
  description: "Find the part. Compare the options from connected sellers.",
  robots: process.env.PARTOVIO_PUBLIC_ORIGIN && process.env.PARTOVIO_DEMO !== "1" ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>
        <a className="skip" href="#content">Skip to content</a>
        <Header />
        <div id="content">{children}</div>
        <ViewBeacon />
        <Footer />
      </body>
    </html>
  );
}
