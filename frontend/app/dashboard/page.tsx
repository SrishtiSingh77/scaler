/* eslint-disable react/jsx-no-bind */
"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api-client";

type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  slug: string;
};

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"event-types" | "bookings">(
    "event-types",
  );
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadEventTypes() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<EventType[]>("/api/event-types");
      setEventTypes(data);
      if (!selectedEvent && data.length > 0) {
        setSelectedEvent(data[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load event types");
    } finally {
      setLoading(false);
    }
  }

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Booking[]>("/api/bookings?scope=upcoming");
      setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventTypes();
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLoadSlots() {
    if (!selectedEvent || !selectedDate) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await apiGet<{ slots: string[] }>(
        `/api/public/event-types/${selectedEvent.slug}/slots?date=${selectedDate}`,
      );
      setSlots(res.slots);
      setSelectedSlot(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!selectedEvent || !selectedSlot || !bookerName || !bookerEmail) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await apiPost(`/api/public/event-types/${selectedEvent.slug}/book`, {
        bookerName,
        bookerEmail,
        startTime: selectedSlot,
      });
      setSuccessMessage("Booking confirmed!");
      setBookerName("");
      setBookerEmail("");
      setSelectedSlot(null);
      await loadBookings();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neo-shell">
      <header className="neo-header">
        <div className="neo-logo">Scaler Cal</div>
        <div className="neo-tag">Light Neo-Brutalism · Admin View</div>
      </header>

      <main className="neo-main">
        <aside className="neo-sidebar">
          <div className="neo-sidebar-title">Dashboard</div>
          <button
            type="button"
            className={`neo-sidebar-link ${
              activeTab === "event-types" ? "active" : ""
            }`}
            onClick={() => setActiveTab("event-types")}
          >
            Event Types
          </button>
          <button
            type="button"
            className={`neo-sidebar-link ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </aside>

        <section className="neo-content-card">
          {activeTab === "event-types" ? (
            <>
              <h1 className="neo-section-title">Event Types & Public Booking</h1>
              <p className="neo-section-subtitle">
                Pick an event type, preview slots, and simulate a booking.
              </p>

              <div className="neo-field">
                <label className="neo-label" htmlFor="eventType">
                  Event type
                </label>
                <select
                  id="eventType"
                  className="neo-input"
                  value={selectedEvent?.id ?? ""}
                  onChange={(e) => {
                    const next = eventTypes.find(
                      (ev) => ev.id === e.target.value,
                    );
                    setSelectedEvent(next ?? null);
                    setSlots([]);
                    setSelectedSlot(null);
                  }}
                >
                  {eventTypes.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="neo-field">
                <label className="neo-label" htmlFor="date">
                  Date (YYYY-MM-DD)
                </label>
                <input
                  id="date"
                  type="date"
                  className="neo-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="neo-button"
                onClick={handleLoadSlots}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load available slots"}
              </button>

              {slots.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="neo-section-subtitle">Available slots</div>
                  <div className="neo-slot-grid">
                    {slots.map((slot) => {
                      const time = new Date(slot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <button
                          type="button"
                          key={slot}
                          className={`neo-slot-button ${
                            selectedSlot === slot ? "selected" : ""
                          }`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedSlot && (
                <div style={{ marginTop: 16 }}>
                  <div className="neo-section-subtitle">Book this slot</div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="bookerName">
                      Name
                    </label>
                    <input
                      id="bookerName"
                      className="neo-input"
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                    />
                  </div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="bookerEmail">
                      Email
                    </label>
                    <input
                      id="bookerEmail"
                      className="neo-input"
                      type="email"
                      value={bookerEmail}
                      onChange={(e) => setBookerEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="neo-button"
                    onClick={handleBook}
                    disabled={loading}
                  >
                    {loading ? "Booking..." : "Confirm booking"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="neo-section-title">Upcoming bookings</h1>
              <p className="neo-section-subtitle">
                Preview upcoming meetings for the default owner.
              </p>
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
                    <div className="neo-pill">{bk.status}</div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div style={{ padding: 10, fontWeight: 600 }}>
                    No upcoming bookings yet.
                  </div>
                )}
              </div>
            </>
          )}

          {error && <div className="neo-error">{error}</div>}
          {successMessage && <div className="neo-success">{successMessage}</div>}
        </section>
      </main>
    </div>
  );
}

