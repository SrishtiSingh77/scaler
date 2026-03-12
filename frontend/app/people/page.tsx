"use client";

import Link from "next/link";

const PEOPLE = [
  {
    name: "Rahul Mehta",
    role: "Product walkthroughs",
    description: "Great for first-time intros, portfolio reviews, or quick Q&A.",
    slug: "intro-call-30",
  },
  {
    name: "Priya Sharma",
    role: "Career & growth chats",
    description:
      "Talk through next steps, projects, or interview prep in a focused slot.",
    slug: "intro-call-30",
  },
];

export default function PeoplePage() {
  return (
    <div className="neo-shell">
      <header className="neo-header">
        <div className="neo-logo">Scaler Cal</div>
        <div className="neo-tag">Pick who you want to meet</div>
      </header>

      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <h1 className="neo-section-title">Choose your host</h1>
          <p className="neo-hero-sub">
            Start by picking the person you want to book. You&apos;ll then move
            into a simple 30-minute booking flow with live availability.
          </p>

          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {PEOPLE.map((person) => (
              <div key={person.name} className="neo-person-card">
                <div className="neo-person-name">{person.name}</div>
                <div className="neo-person-role">{person.role}</div>
                <p className="neo-person-highlight">{person.description}</p>
                <Link
                  href={`/book/${person.slug}`}
                  className="neo-button"
                >
                  Book 30 min with {person.name.split(" ")[0]}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

