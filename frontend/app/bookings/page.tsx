"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPostVoid } from "../api-client";

type Booking = {
  id: string;
  bookerName: string;
  bookerEmail: string;
  startTime: string;
  status: string;
  eventType: {
    title: string;
  };
};

type Scope = "upcoming" | "past" | "all";

export default function BookingsDashboardPage() {
  const [scope, setScope] = useState<Scope>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBookings(nextScope: Scope = scope) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Booking[]>(
        `/api/bookings?scope=${encodeURIComponent(nextScope)}`,
      );
      setBookings(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load bookings",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings("upcoming");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="neo-shell">
      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <h1 className="neo-section-title">Bookings dashboard</h1>
          <p className="neo-hero-sub">
            View upcoming and past bookings for the default owner, and cancel
            meetings when plans change.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {(["upcoming", "past", "all"] as Scope[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`neo-button ${
                  scope === s ? "" : "neo-button-secondary"
                }`}
                onClick={() => {
                  setScope(s);
                  loadBookings(s);
                }}
                disabled={loading && scope === s}
              >
                {s === "upcoming" && "Upcoming"}
                {s === "past" && "Past"}
                {s === "all" && "All"}
              </button>
            ))}
          </div>

          {loading && <p>Loading bookings…</p>}
          {error && <div className="neo-error">{error}</div>}

          <div className="neo-list">
            {bookings.map((bk) => (
              <div key={bk.id} className="neo-list-item">
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {bk.eventType?.title ?? "Event"}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    {new Date(bk.startTime).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {bk.bookerName} · {bk.bookerEmail}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="neo-pill">{bk.status}</div>
                  {bk.status !== "CANCELLED" && (
                    <button
                      type="button"
                      className="neo-button red"
                      onClick={async () => {
                        try {
                          await apiPostVoid(`/api/bookings/${bk.id}/cancel`);
                          await loadBookings();
                        } catch (e) {
                          setError(
                            e instanceof Error
                              ? e.message
                              : "Failed to cancel booking",
                          );
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!loading && bookings.length === 0 && (
              <p style={{ padding: 10, fontWeight: 600 }}>
                No bookings found for this view.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

