"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "../../api-client";
import { Calendar } from "../../../components/Calendar";
import emailjs from "@emailjs/browser";

type PublicEvent = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  slug: string;
  schedule: {
    id: string;
    name: string;
    timezone: string;
  } | null;
};

export default function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const todayIso = new Date().toISOString().split("T")[0];
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [date, setDate] = useState(todayIso);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const EMAILJS_SERVICE_ID =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
  const EMAILJS_TEMPLATE_ID =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
  const EMAILJS_PUBLIC_KEY =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await apiGet<PublicEvent>(
          `/api/public/event-types/${slug}`,
        );
        setEvent(data);
      } catch {
        setError("This event is not available.");
      }
    }
    if (slug) {
      loadEvent();
    }
  }, [slug]);

  async function loadSlots() {
    if (!date || !event) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await apiGet<{ slots: string[] }>(
        `/api/public/event-types/${event.slug}/slots?date=${date}`,
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
    if (!event || !selectedSlot || !bookerName || !bookerEmail) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await apiPost(`/api/public/event-types/${event.slug}/book`, {
        bookerName,
        bookerEmail,
        startTime: selectedSlot,
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const slotDate = new Date(selectedSlot);
        const dateString = slotDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeString = slotDate.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
        const timezone =
          event.schedule?.timezone ? ` (${event.schedule.timezone})` : "";

        const message = `Hi ${bookerName},

Thank you for scheduling a call with us.

Here are your booking details:
- Topic: ${event.title}
- Description: ${event.description}
- Duration: ${event.durationMinutes} minutes
- Date & Time: ${dateString} at ${timeString}${timezone}

If you need to reschedule or cancel, please reply to this email and we’ll be happy to help.

Best regards,`;

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_name: bookerName,
            to_email: bookerEmail,
            subject: `Your booking is confirmed: ${event.title}`,
            message,
            event_title: event.title,
            event_description: event.description,
            event_duration: `${event.durationMinutes} minutes`,
            event_datetime: `${dateString} at ${timeString}${timezone}`,
          },
          EMAILJS_PUBLIC_KEY,
        );
      }

      setSuccessMessage("Booking confirmed!");
      setBookerName("");
      setBookerEmail("");
      setSelectedSlot(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neo-shell">
      {/* <header className="neo-header">
        <div className="neo-logo">Calix</div>
        <div className="neo-tag">Public booking</div>
      </header> */}

      <main className="neo-main">
        <section className="neo-content-card" style={{ gridColumn: "1 / span 2" }}>
          {!event && !error && <p>Loading event…</p>}
          {error && <div className="neo-error">{error}</div>}

          {event && (
            <>
              <h1 className="neo-section-title">{event.title}</h1>
              <p className="neo-section-subtitle">
                {event.durationMinutes} minutes ·{" "}
                {event.schedule
                  ? `${event.schedule.timezone} · ${event.schedule.name}`
                  : "Flexible availability"}
              </p>
              <p style={{ marginBottom: 16 }}>{event.description}</p>

              <div className="neo-field">
                <label className="neo-label" htmlFor="date">
                  Choose date
                </label>
                <div style={{ marginTop: 8 }}>
                  <Calendar
                    selected={selectedDate}
                    onSelect={(next) => {
                      if (!next) return;
                      const iso = next.toISOString().split("T")[0];
                      setSelectedDate(next);
                      setDate(iso);
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="neo-button"
                onClick={loadSlots}
                disabled={loading}
              >
                {loading ? "Loading..." : "Show available slots"}
              </button>

              {slots.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="neo-section-subtitle">Available slots</div>
                  {(() => {
                    const now = new Date();
                    const upcomingSlots = slots.filter(
                      (slot) => new Date(slot) >= now,
                    );

                    if (upcomingSlots.length === 0) {
                      return (
                        <p style={{ marginTop: 8 }}>
                          No future slots are available for the selected date.
                        </p>
                      );
                    }

                    return (
                      <div className="neo-slot-grid">
                        {upcomingSlots.map((slot) => {
                          const slotDate = new Date(slot);
                          const time = slotDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          return (
                            <button
                              type="button"
                              key={slot}
                              className={`neo-slot-button ${selectedSlot === slot ? "selected" : ""
                                }`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {time}
                              {event?.schedule?.timezone && (
                                <span
                                  style={{
                                    display: "block",
                                    fontSize: 12,
                                    opacity: 0.8,
                                    marginTop: 2,
                                  }}
                                >
                                  {event.schedule.timezone}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {selectedSlot && (
                <div style={{ marginTop: 16 }}>
                  <div className="neo-section-subtitle">Your details</div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      className="neo-input"
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                    />
                  </div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
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

              {error && <div className="neo-error">{error}</div>}
              {successMessage && (
                <div className="neo-success">{successMessage}</div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}