import Link from "next/link";
import { Suspense } from "react";
import { ContextControls } from "./chrome";

export function Header() {
  return (
    <header className="header">
      <div className="bar">
        <Link href="/" className="brand">
          <span className="mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M5 5L2 8l3 3M11 5l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          Partovio
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/search">Search</Link>
          <Link href="/catalog">Categories</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/suppliers">For suppliers</Link>
        </nav>
        <div className="spacer" />
        <Suspense fallback={null}>
          <ContextControls />
        </Suspense>
        <Link className="signin" href="/account">Sign in</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/suppliers">For suppliers</Link>
          <Link href="/mcp-docs">API</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <span className="muted">Find the part. Compare the options.</span>
      </div>
    </footer>
  );
}

export function SearchForm({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  return (
    <form className="search" action="/search" method="get" role="search">
      <label className="skip" htmlFor={large ? "home-q" : "q"}>Part number, model, or name</label>
      <input
        id={large ? "home-q" : "q"}
        name="q"
        defaultValue={initial}
        maxLength={128}
        autoComplete="off"
        spellCheck={false}
        placeholder="Enter a part number, model, or keyword"
        required
      />
      <button type="submit">Search</button>
    </form>
  );
}
