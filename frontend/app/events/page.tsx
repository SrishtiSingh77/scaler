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

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet<EventType[]>("/api/event-types/events");
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
      {/* <header className="neo-header">
        <div className="neo-logo">Scaler Cal</div>
        <div className="neo-tag">All event types</div>
      </header> */}

      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <h1 className="neo-section-title">Pick an event</h1>
          <p className="neo-hero-sub">
            Every event type has its own unique public link. Share it or click
            through below to open the booking page for that event.
          </p>

          {loading && <p>Loading events…</p>}
          {error && <div className="neo-error">{error}</div>}

          <div className="neo-events-grid">
            {events.map((ev) => (
              <div key={ev.id} className="neo-person-card">
                <div className="neo-person-name">{ev.title}</div>
                <div className="neo-person-role">
                  {ev.durationMinutes} minute meeting
                </div>
                <p className="neo-person-highlight">{ev.description}</p>
                <p style={{ fontSize: 12, marginBottom: 8 }}>
                  Public link:{" "}
                  <span style={{ fontWeight: 700 }}>
                    /book/
                    {ev.slug}
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <Link
                    href={`/book/${ev.slug}`}
                    className="neo-button"
                    style={{ flex: 1, textAlign: "center", minWidth: 140 }}
                  >
                    Open booking page
                  </Link>
                  <button
                    type="button"
                    className="neo-button"
                    onClick={async () => {
                      const origin =
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "";
                      const url = `${origin}/book/${ev.slug}`;
                      try {
                        await navigator.clipboard.writeText(url);
                        setCopiedSlug(ev.slug);
                        setTimeout(() => setCopiedSlug(null), 1500);
                      } catch {
                        // ignore clipboard errors
                      }
                    }}
                  >
                    {copiedSlug === ev.slug ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </div>
            ))}
            {!loading && events.length === 0 && (
              <p style={{ fontWeight: 600 }}>No event types created yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}