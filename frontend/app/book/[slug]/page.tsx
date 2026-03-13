// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { apiGet, apiPost } from "../../api-client";
// // import { Calendar } from "../../../components/Calendar";
// import { Calendar } from "@/components/Calendar";
// import emailjs from "@emailjs/browser";

// type PublicEvent = {
//   id: string;
//   title: string;
//   description: string;
//   durationMinutes: number;
//   slug: string;
//   schedule: {
//     id: string;
//     name: string;
//     timezone: string;
//   } | null;
// };

// export default function PublicBookingPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//     new Date(),
//   );
//   const todayIso = new Date().toISOString().split("T")[0];
//   const [event, setEvent] = useState<PublicEvent | null>(null);
//   const [date, setDate] = useState(todayIso);
//   const [slots, setSlots] = useState<string[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
//   const [bookerName, setBookerName] = useState("");
//   const [bookerEmail, setBookerEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const EMAILJS_SERVICE_ID =
//     process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
//   const EMAILJS_TEMPLATE_ID =
//     process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
//   const EMAILJS_PUBLIC_KEY =
//     process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

//   useEffect(() => {
//     async function loadEvent() {
//       try {
//         const data = await apiGet<PublicEvent>(
//           `/api/public/event-types/${slug}`,
//         );
//         setEvent(data);
//       } catch {
//         setError("This event is not available.");
//       }
//     }
//     if (slug) {
//       loadEvent();
//     }
//   }, [slug]);

//   async function loadSlots() {
//     if (!date || !event) return;
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
//     try {
//       const res = await apiGet<{ slots: string[] }>(
//         `/api/public/event-types/${event.slug}/slots?date=${date}`,
//       );
//       setSlots(res.slots);
//       setSelectedSlot(null);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load slots");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleBook() {
//     if (!event || !selectedSlot || !bookerName || !bookerEmail) return;
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
//     try {
//       await apiPost(`/api/public/event-types/${event.slug}/book`, {
//         bookerName,
//         bookerEmail,
//         startTime: selectedSlot,
//       });

//       if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
//         const slotDate = new Date(selectedSlot);
//         const dateString = slotDate.toLocaleDateString(undefined, {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         });
//         const timeString = slotDate.toLocaleTimeString(undefined, {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         const timezone =
//           event.schedule?.timezone ? ` (${event.schedule.timezone})` : "";

//         const message = `Hi ${bookerName},

// Thank you for scheduling a call with us.

// Here are your booking details:
// - Topic: ${event.title}
// - Description: ${event.description}
// - Duration: ${event.durationMinutes} minutes
// - Date & Time: ${dateString} at ${timeString}${timezone}

// If you need to reschedule or cancel, please reply to this email and we’ll be happy to help.

// Best regards,`;

//         await emailjs.send(
//           EMAILJS_SERVICE_ID,
//           EMAILJS_TEMPLATE_ID,
//           {
//             to_name: bookerName,
//             to_email: bookerEmail,
//             subject: `Your booking is confirmed: ${event.title}`,
//             message,
//             event_title: event.title,
//             event_description: event.description,
//             event_duration: `${event.durationMinutes} minutes`,
//             event_datetime: `${dateString} at ${timeString}${timezone}`,
//           },
//           EMAILJS_PUBLIC_KEY,
//         );
//       }

//       setSuccessMessage("Booking confirmed!");
//       setBookerName("");
//       setBookerEmail("");
//       setSelectedSlot(null);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="neo-shell">
//       {/* <header className="neo-header">
//         <div className="neo-logo">Calix</div>
//         <div className="neo-tag">Public booking</div>
//       </header> */}

//       <main className="neo-main">
//         <section className="neo-content-card" style={{ gridColumn: "1 / span 2" }}>
//           {!event && !error && <p>Loading event…</p>}
//           {error && <div className="neo-error">{error}</div>}

//           {event && (
//             <>
//               <h1 className="neo-section-title">{event.title}</h1>
//               <p className="neo-section-subtitle">
//                 {event.durationMinutes} minutes ·{" "}
//                 {event.schedule
//                   ? `${event.schedule.timezone} · ${event.schedule.name}`
//                   : "Flexible availability"}
//               </p>
//               <p style={{ marginBottom: 16 }}>{event.description}</p>

//               <div className="neo-field">
//                 <label className="neo-label" htmlFor="date">
//                   Choose date
//                 </label>
//                 <div style={{ marginTop: 8 }}>
//                   <Calendar
//                     selected={selectedDate}
//                     onSelect={(next) => {
//                       if (!next) return;
//                       const iso = next.toISOString().split("T")[0];
//                       setSelectedDate(next);
//                       setDate(iso);
//                     }}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 className="neo-button"
//                 onClick={loadSlots}
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Show available slots"}
//               </button>

//               {slots.length > 0 && (
//                 <div style={{ marginTop: 16 }}>
//                   <div className="neo-section-subtitle">Available slots</div>
//                   {(() => {
//                     const now = new Date();
//                     const upcomingSlots = slots.filter(
//                       (slot) => new Date(slot) >= now,
//                     );

//                     if (upcomingSlots.length === 0) {
//                       return (
//                         <p style={{ marginTop: 8 }}>
//                           No future slots are available for the selected date.
//                         </p>
//                       );
//                     }

//                     return (
//                       <div className="neo-slot-grid">
//                         {upcomingSlots.map((slot) => {
//                           const slotDate = new Date(slot);
//                           const time = slotDate.toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           });
//                           return (
//                             <button
//                               type="button"
//                               key={slot}
//                               className={`neo-slot-button ${selectedSlot === slot ? "selected" : ""
//                                 }`}
//                               onClick={() => setSelectedSlot(slot)}
//                             >
//                               {time}
//                               {event?.schedule?.timezone && (
//                                 <span
//                                   style={{
//                                     display: "block",
//                                     fontSize: 12,
//                                     opacity: 0.8,
//                                     marginTop: 2,
//                                   }}
//                                 >
//                                   {event.schedule.timezone}
//                                 </span>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     );
//                   })()}
//                 </div>
//               )}

//               {selectedSlot && (
//                 <div style={{ marginTop: 16 }}>
//                   <div className="neo-section-subtitle">Your details</div>
//                   <div className="neo-field">
//                     <label className="neo-label" htmlFor="name">
//                       Name
//                     </label>
//                     <input
//                       id="name"
//                       className="neo-input"
//                       value={bookerName}
//                       onChange={(e) => setBookerName(e.target.value)}
//                     />
//                   </div>
//                   <div className="neo-field">
//                     <label className="neo-label" htmlFor="email">
//                       Email
//                     </label>
//                     <input
//                       id="email"
//                       className="neo-input"
//                       type="email"
//                       value={bookerEmail}
//                       onChange={(e) => setBookerEmail(e.target.value)}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     className="neo-button"
//                     onClick={handleBook}
//                     disabled={loading}
//                   >
//                     {loading ? "Booking..." : "Confirm booking"}
//                   </button>
//                 </div>
//               )}

//               {error && <div className="neo-error">{error}</div>}
//               {successMessage && (
//                 <div className="neo-success">{successMessage}</div>
//               )}
//             </>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "../../api-client";
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

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatTime(iso: string, use24h: boolean) {
  const d = new Date(iso);
  if (use24h) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString([], { weekday: "short", day: "numeric" });
}

export default function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>();

  const today = new Date();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [use24h, setUse24h] = useState(false);

  // Booking form
  const [showForm, setShowForm] = useState(false);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await apiGet<PublicEvent>(`/api/public/event-types/${slug}`);
        setEvent(data);
      } catch {
        setError("This event is not available.");
      }
    }
    if (slug) loadEvent();
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    async function loadSlots() {
      setSlotsLoading(true);
      setSelectedSlot(null);
      setShowForm(false);
      try {
        const iso = selectedDate.toISOString().split("T")[0];
        const res = await apiGet<{ slots: string[] }>(
          `/api/public/event-types/${event!.slug}/slots?date=${iso}`
        );
        const now = new Date();
        setSlots(res.slots.filter((s) => new Date(s) >= now));
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, [selectedDate, event]);

  async function handleBook() {
    if (!event || !selectedSlot || !bookerName || !bookerEmail) return;
    setBookingLoading(true);
    setError(null);
    try {
      await apiPost(`/api/public/event-types/${event.slug}/book`, {
        bookerName,
        bookerEmail,
        startTime: selectedSlot,
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const slotDate = new Date(selectedSlot);
        const dateString = slotDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
        const timeString = slotDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        const timezone = event.schedule?.timezone ? ` (${event.schedule.timezone})` : "";
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_name: bookerName,
          to_email: bookerEmail,
          subject: `Your booking is confirmed: ${event.title}`,
          message: `Hi ${bookerName},\n\nYour ${event.title} (${event.durationMinutes} min) is confirmed for ${dateString} at ${timeString}${timezone}.`,
          event_title: event.title,
          event_datetime: `${dateString} at ${timeString}${timezone}`,
        }, EMAILJS_PUBLIC_KEY);
      }

      setSuccessMessage(`Booking confirmed for ${new Date(selectedSlot).toLocaleString()}!`);
      setBookerName("");
      setBookerEmail("");
      setSelectedSlot(null);
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d: number) =>
    d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
  const isPast = (d: number) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {!event && !error && (
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading event…</p>
      )}
      {error && !event && (
        <div style={{ color: "#dc2626", fontSize: 14 }}>{error}</div>
      )}

      {event && (
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          display: "grid",
          gridTemplateColumns: "260px 1px 1fr 1px 300px",
          minHeight: 520,
          overflow: "hidden",
          width: "100%",
          maxWidth: 1060,
        }}>

          {/* Panel 1: Host info */}
          <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
            }}>
              {event.title[0]?.toUpperCase()}
            </div>

            <div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Srishti Singh</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 16 }}>
                {event.title}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span style={{ fontSize: 13, color: "#374151" }}>{event.durationMinutes}m</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" />
                  </svg>
                  <span style={{ fontSize: 13, color: "#374151" }}>Cal Video</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    {event.schedule?.timezone ?? "Asia/Kolkata"}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {event.description && (
              <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.6, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                {event.description}
              </p>
            )}

            {successMessage && (
              <div style={{
                padding: "12px 14px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 6,
                fontSize: 13,
                color: "#16a34a",
                lineHeight: 1.5,
              }}>
                ✓ {successMessage}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ backgroundColor: "#e5e7eb" }} />

          {/* Panel 2: Calendar */}
          <div style={{ padding: "32px 28px" }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
                {MONTHS[viewMonth]}{" "}
                <span style={{ color: "#9ca3af", fontWeight: 400 }}>{viewYear}</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[{ dir: "left", fn: prevMonth }, { dir: "right", fn: nextMonth }].map(({ dir, fn }) => (
                  <button key={dir} type="button" onClick={fn} style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: "1px solid #e5e7eb", background: "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Day labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", padding: "2px 0" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Date grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const sel = isSelected(day);
                const tod = isToday(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={past}
                    onClick={() => setSelectedDate(new Date(viewYear, viewMonth, day))}
                    style={{
                      height: 38,
                      borderRadius: 8,
                      border: sel ? "2px solid #111827" : past ? "1px solid transparent" : "1px solid #e5e7eb",
                      backgroundColor: sel ? "#111827" : past ? "transparent" : "#f9fafb",
                      color: sel ? "#fff" : past ? "#d1d5db" : "#111827",
                      fontSize: 13,
                      fontWeight: sel || tod ? 600 : 400,
                      cursor: past ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {day}
                    {tod && !sel && (
                      <span style={{
                        position: "absolute", bottom: 4, left: "50%",
                        transform: "translateX(-50%)",
                        width: 4, height: 4, borderRadius: "50%",
                        backgroundColor: "#111827",
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ backgroundColor: "#e5e7eb" }} />

          {/* Panel 3: Slots */}
          <div style={{ padding: "32px 20px", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {formatDayHeader(selectedDate)}
              </div>
              <div style={{ display: "flex", gap: 0, border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
                {["12h", "24h"].map((fmt) => (
                  <button key={fmt} type="button" onClick={() => setUse24h(fmt === "24h")} style={{
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: (fmt === "24h") === use24h ? "#111827" : "#fff",
                    color: (fmt === "24h") === use24h ? "#fff" : "#6b7280",
                    transition: "all 0.15s",
                  }}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Slot list */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {slotsLoading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ height: 40, backgroundColor: "#f3f4f6", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
                  ))}
                </div>
              )}

              {!slotsLoading && slots.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 13 }}>
                  No slots available for this date.
                </div>
              )}

              {!slotsLoading && !showForm && slots.map((slot) => {
                const isSel = selectedSlot === slot;
                return (
                  <button key={slot} type="button" onClick={() => { setSelectedSlot(slot); setShowForm(true); }} style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: isSel ? "2px solid #111827" : "1px solid #e5e7eb",
                    backgroundColor: isSel ? "#111827" : "#fff",
                    color: isSel ? "#fff" : "#111827",
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      backgroundColor: isSel ? "#fff" : "#22c55e",
                      flexShrink: 0,
                    }} />
                    {formatTime(slot, use24h)}
                  </button>
                );
              })}

              {/* Booking form inline */}
              {showForm && selectedSlot && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {/* Back */}
                  <button type="button" onClick={() => { setShowForm(false); setSelectedSlot(null); }} style={{
                    background: "none", border: "none", cursor: "pointer", color: "#6b7280",
                    fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginBottom: 16, padding: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to slots
                  </button>

                  <div style={{
                    padding: "12px 14px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 13,
                    color: "#374151",
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{formatTime(selectedSlot, use24h)}</div>
                    <div style={{ color: "#6b7280" }}>{selectedDate.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Your name
                    </label>
                    <input
                      type="text"
                      value={bookerName}
                      onChange={e => setBookerName(e.target.value)}
                      placeholder="John Doe"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                        fontSize: 13.5,
                        outline: "none",
                        boxSizing: "border-box",
                        color: "#111827",
                        backgroundColor: "#fff",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={bookerEmail}
                      onChange={e => setBookerEmail(e.target.value)}
                      placeholder="john@example.com"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                        fontSize: 13.5,
                        outline: "none",
                        boxSizing: "border-box",
                        color: "#111827",
                        backgroundColor: "#fff",
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ fontSize: 12.5, color: "#dc2626", marginBottom: 10 }}>{error}</div>
                  )}

                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={bookingLoading || !bookerName || !bookerEmail}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: !bookerName || !bookerEmail ? "#d1d5db" : "#111827",
                      color: "#fff",
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: !bookerName || !bookerEmail ? "not-allowed" : "pointer",
                      transition: "background-color 0.15s",
                    }}
                  >
                    {bookingLoading ? "Confirming…" : "Confirm booking"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>
    </div>
  );
}