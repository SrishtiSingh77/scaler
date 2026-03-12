"use client";

import Link from "next/link";

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
      <header className="neo-header">
        <div className="neo-logo">Scaler Cal</div>
        <div className="neo-tag">Book time with the right person</div>
      </header>

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
            <h1 className="neo-section-title">
              Stop emailing. Share a link. Get booked.
            </h1>
            <p className="neo-hero-sub">
              Choose who you want to meet, pick an event type, and confirm a
              time in seconds. Availability, timezones, and double bookings are
              handled automatically behind the scenes.
            </p>

            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 18px 0",
                display: "grid",
                gap: 10,
              }}
            >
              <li className="neo-sidebar">
                <div className="neo-sidebar-title">1 · Event Types</div>
                <p style={{ fontSize: 13 }}>
                  Create and manage event types with title, description,
                  duration, and a unique URL slug – all visible on a central
                  dashboard and exposed as public booking links.
                </p>
              </li>
              <li className="neo-sidebar">
                <div className="neo-sidebar-title">2 · Availability</div>
                <p style={{ fontSize: 13 }}>
                  Configure which days (e.g. Monday–Friday), what hours (like
                  9:00–17:00), and which timezone you&apos;re bookable in so
                  your schedule is always respected.
                </p>
              </li>
              <li className="neo-sidebar">
                <div className="neo-sidebar-title">3 · Public booking page</div>
                <p style={{ fontSize: 13 }}>
                  Guests land on a public page, pick a date on the calendar,
                  choose an available slot, and share their name and email –
                  with strict protection against double booking.
                </p>
              </li>
              <li className="neo-sidebar">
                <div className="neo-sidebar-title">4 · Bookings dashboard</div>
                <p style={{ fontSize: 13 }}>
                  Behind the scenes, an admin dashboard tracks upcoming and past
                  bookings and lets you cancel slots when plans change.
                </p>
              </li>
            </ol>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link
                href={`/book/${primary.slug}`}
                className="neo-button"
                aria-label={`Get started by booking with ${primary.name}`}
              >
                Get started
              </Link>
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                No login · book in under a minute
              </span>
            </div>
          </div>

          <div
            className="neo-sidebar"
            style={{
              background: "#fff8d6",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="neo-sidebar-title">Who can I book?</div>
              <p style={{ fontSize: 13, marginBottom: 10 }}>
                Pick a person and jump straight into their booking page.
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {PEOPLE.map((person) => (
                  <div
                    key={person.slug}
                    className="neo-person-card"
                  >
                    <div className="neo-person-name">{person.name}</div>
                    <div className="neo-person-role">{person.role}</div>
                    <p className="neo-person-highlight">{person.highlight}</p>
                    <Link
                      href={`/book/${person.slug}`}
                      className="neo-button"
                    >
                      Book {person.name.split(" ")[0]}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                marginTop: 12,
              }}
            >
              Built as a Cal.com-style assignment: event types, availability,
              public booking, and a clean bookings dashboard for the default
              admin.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
