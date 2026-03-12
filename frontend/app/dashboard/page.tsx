/* eslint-disable react/jsx-no-bind */
"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPostVoid, apiPut } from "../api-client";

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
  const [activeTab, setActiveTab] = useState<
    "event-types" | "availability" | "bookings"
  >("event-types");
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

  const [schedules, setSchedules] = useState<
    { id: string; name: string; timezone: string }[]
  >([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    durationMinutes: 30,
    slug: "",
    scheduleId: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [newSchedule, setNewSchedule] = useState({
    name: "Weekdays 9–5",
    timezone: "Asia/Kolkata",
  });

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

  async function loadSchedules() {
    try {
      const data = await apiGet<
        { id: string; name: string; timezone: string }[]
      >("/api/availability/schedules");
      setSchedules(data);
      if (!newEvent.scheduleId && data.length > 0) {
        setNewEvent((prev) => ({ ...prev, scheduleId: data[0].id }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedules");
    }
  }

  useEffect(() => {
    loadEventTypes();
    loadBookings();
    loadSchedules();
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
              activeTab === "availability" ? "active" : ""
            }`}
            onClick={() => setActiveTab("availability")}
          >
            Availability
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
              <h1 className="neo-section-title">Event types</h1>
              <p className="neo-section-subtitle">
                Create, edit, or remove event types for the default owner.
              </p>
              <div className="neo-field">
                <label className="neo-label" htmlFor="et-title">
                  Title
                </label>
                <input
                  id="et-title"
                  className="neo-input"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="neo-field">
                <label className="neo-label" htmlFor="et-desc">
                  Description
                </label>
                <input
                  id="et-desc"
                  className="neo-input"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="neo-field">
                <label className="neo-label" htmlFor="et-duration">
                  Duration (minutes)
                </label>
                <input
                  id="et-duration"
                  type="number"
                  min={5}
                  className="neo-input"
                  value={newEvent.durationMinutes}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      durationMinutes: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="neo-field">
                <label className="neo-label" htmlFor="et-slug">
                  URL slug
                </label>
                <input
                  id="et-slug"
                  className="neo-input"
                  value={newEvent.slug}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>
              <div className="neo-field">
                <label className="neo-label" htmlFor="et-schedule">
                  Availability schedule
                </label>
                <select
                  id="et-schedule"
                  className="neo-input"
                  value={newEvent.scheduleId}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      scheduleId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select schedule…</option>
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.timezone})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="neo-button"
                disabled={loading || !newEvent.title || !newEvent.slug}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  setSuccessMessage(null);
                  try {
                    if (editingId) {
                      await apiPut(`/api/event-types/${editingId}`, newEvent);
                      setEditingId(null);
                    } else {
                      await apiPost("/api/event-types", newEvent);
                    }
                    setNewEvent((prev) => ({
                      ...prev,
                      title: "",
                      description: "",
                      slug: "",
                    }));
                    await loadEventTypes();
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "Failed to save event type",
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {editingId ? "Update event type" : "Create event type"}
              </button>

              <div className="neo-list">
                {eventTypes.map((ev) => (
                  <div key={ev.id} className="neo-list-item">
                    <div>
                      <div style={{ fontWeight: 700 }}>{ev.title}</div>
                      <div style={{ fontSize: 12 }}>{ev.description}</div>
                      <div style={{ fontSize: 11 }}>
                        {ev.durationMinutes} min · /book/{ev.slug}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="neo-button"
                        onClick={() => {
                          setEditingId(ev.id);
                          setNewEvent({
                            title: ev.title,
                            description: ev.description,
                            durationMinutes: ev.durationMinutes,
                            slug: ev.slug,
                            scheduleId: newEvent.scheduleId,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="neo-button red"
                        onClick={async () => {
                          setLoading(true);
                          setError(null);
                          setSuccessMessage(null);
                          try {
                            await apiDelete(`/api/event-types/${ev.id}`);
                            await loadEventTypes();
                          } catch (e) {
                            setError(
                              e instanceof Error
                                ? e.message
                                : "Failed to delete event type",
                            );
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === "availability" ? (
            <>
              <h1 className="neo-section-title">Availability</h1>
              <p className="neo-section-subtitle">
                Define when the default owner can be booked.
              </p>

              <div className="neo-field">
                <label className="neo-label" htmlFor="sch-name">
                  Schedule name
                </label>
                <input
                  id="sch-name"
                  className="neo-input"
                  value={newSchedule.name}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="neo-field">
                <label className="neo-label" htmlFor="sch-tz">
                  Timezone (IANA)
                </label>
                <input
                  id="sch-tz"
                  className="neo-input"
                  value={newSchedule.timezone}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                />
              </div>
              <p style={{ fontSize: 12, marginBottom: 8 }}>
                This quick editor creates a Monday–Friday 09:00–17:00 schedule
                in the selected timezone.
              </p>
              <button
                type="button"
                className="neo-button"
                disabled={loading || !newSchedule.name || !newSchedule.timezone}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  setSuccessMessage(null);
                  try {
                    const rules = [1, 2, 3, 4, 5].map((day) => ({
                      dayOfWeek: day,
                      startTimeMinutes: 9 * 60,
                      endTimeMinutes: 17 * 60,
                    }));
                    await apiPost("/api/availability/schedules", {
                      name: newSchedule.name,
                      timezone: newSchedule.timezone,
                      rules,
                    });
                    await loadSchedules();
                    setSuccessMessage("Schedule created");
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "Failed to create schedule",
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Create schedule
              </button>

              <div className="neo-list">
                {schedules.map((s) => (
                  <div key={s.id} className="neo-list-item">
                    <div>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 12 }}>{s.timezone}</div>
                    </div>
                    <button
                      type="button"
                      className="neo-button red"
                      onClick={async () => {
                        setLoading(true);
                        setError(null);
                        setSuccessMessage(null);
                        try {
                          await apiDelete(
                            `/api/availability/schedules/${s.id}`,
                          );
                          await loadSchedules();
                        } catch (e) {
                          setError(
                            e instanceof Error
                              ? e.message
                              : "Failed to delete schedule",
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="neo-section-title">Bookings</h1>
              <p className="neo-section-subtitle">
                Preview and manage bookings for the default owner.
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
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="neo-pill">{bk.status}</div>
                      {bk.status !== "CANCELLED" && (
                        <button
                          type="button"
                          className="neo-button red"
                          onClick={async () => {
                            try {
                              await apiPostVoid(
                                `/api/bookings/${bk.id}/cancel`,
                              );
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

