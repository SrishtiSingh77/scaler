"use client";

import Link from "next/link";
import Image from "next/image";

const PEOPLE = [
  {
    name: "Rahul Mehta",
    role: "Product walkthroughs",
    slug: "intro-call-30",
    highlight: "30-minute intro calls for candidates, clients, or teammates.",
  },
  {
    name: "Priya Sharma",
    role: "Deep-dive sessions",
    slug: "deep-dive-60",
    highlight: "60-minute strategy or architecture deep dives.",
  },
];

export default function LandingPage() {
  const primary = PEOPLE[0];

  return (
    <div className="neo-shell">
      <main className="neo-main">
        <section
          className="neo-content-card neo-hero-grid"
          style={{
            gridColumn: "1 / span 2",
          }}
        >
          <div>
            <div className="neo-hero-badge">
              <span>Scheduling Platform</span>
              <span>·</span>
              <span>Cal.com style</span>
            </div>
            <h1 className="neo-hero-title">
              Stop emailing. Share a link. Get booked.
            </h1>
            <p className="neo-hero-sub">
              Choose who you want to meet, pick an event type, and confirm a
              time in seconds. Availability, timezones, and double bookings are
              handled automatically behind the scenes.
            </p>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/people" className="neo-button">
                Get started
              </Link>
              {/* <span style={{ fontSize: 12, fontWeight: 600 }}>
                No login · book in under a minute
              </span> */}
            </div>
          </div>

          <div className="neo-hero-visual">
            <Image
              src="/poster.png"
              alt="Two people scheduling meetings across the world"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
            {/* <div className="neo-hero-chip">Available worldwide</div> */}
          </div>
        </section>
      </main>

      <main className="neo-main" style={{ paddingTop: 0 }}>
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <div>
            <div className="neo-section-subtitle">What this app does</div>
            <h2 className="neo-section-title">Everything you need to get booked</h2>

            <div className="neo-feature-row">
              <div className="neo-feature-card">
                <div className="neo-feature-icon">ET</div>
                <div className="neo-feature-title">Event types you control</div>
                <p className="neo-feature-copy">
                  Design different kinds of meetings with their own title,
                  description, duration, and clean URL slug – all managed from a
                  single dashboard.
                </p>
              </div>
              <div className="neo-feature-card">
                <div className="neo-feature-icon">⏰</div>
                <div className="neo-feature-title">Smart availability</div>
                <p className="neo-feature-copy">
                  Tell the system which days you take calls and the exact
                  working hours in your timezone, and it does the math for
                  every visitor.
                </p>
              </div>
              <div className="neo-feature-card">
                <div className="neo-feature-icon">🌐</div>
                <div className="neo-feature-title">Public booking page</div>
                <p className="neo-feature-copy">
                  Share a single link where guests choose a date, see free
                  slots, drop in their name and email, and book without any
                  double‑booking surprises.
                </p>
              </div>
              <div className="neo-feature-card">
                <div className="neo-feature-icon">📅</div>
                <div className="neo-feature-title">Bookings at a glance</div>
                <p className="neo-feature-copy">
                  Behind the scenes, a simple dashboard shows upcoming and past
                  meetings and lets the owner cancel slots when plans change.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
