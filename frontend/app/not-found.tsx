"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="neo-shell">
      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fff0f3" }}
        >
          <div className="neo-hero-badge">
            <span>404</span>
            <span>·</span>
            <span>Page not found</span>
          </div>
          <h1 className="neo-hero-title">This link went off-grid.</h1>
          <p className="neo-hero-sub">
            The page you&apos;re looking for doesn&apos;t exist, or the meeting
            link has moved. You can jump back into the main flows below.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" className="neo-button">
              Go home
            </Link>
            <Link href="/events" className="neo-button">
              View all events
            </Link>
            <Link href="/people" className="neo-button">
              Pick a person
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

