"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "../api-client";

type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  slug: string;
};

export default function PeoplePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet<EventType[]>("/api/event-types/people");
        setEvents(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load event types",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="neo-shell">
      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <h1 className="neo-section-title">Choose your host</h1>
          <p className="neo-hero-sub">
            Start by picking the event you want to book. Each one represents a
            specific person and meeting type.
          </p>

          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Link href="/people/new" className="neo-button">
              + Add new person
            </Link>
          </div>

          {loading && <p>Loading people…</p>}
          {error && <div className="neo-error">{error}</div>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            {events.map((ev) => (
              <div key={ev.id} className="neo-person-card">
                <div className="neo-person-name">{ev.title}</div>
                <div className="neo-person-role">
                  {ev.durationMinutes} minute meeting
                </div>
                <p className="neo-person-highlight">{ev.description}</p>
                <Link href={`/book/${ev.slug}`} className="neo-button">
                  Book {ev.durationMinutes} min
                </Link>
              </div>
            ))}
            {!loading && events.length === 0 && (
              <p style={{ fontWeight: 600 }}>
                No event types created yet. Create one in the dashboard.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

