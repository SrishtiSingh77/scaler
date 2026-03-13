// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { apiGet } from "../api-client";

// type EventType = {
//   id: string;
//   title: string;
//   description: string;
//   durationMinutes: number;
//   slug: string;
// };

// export default function PeoplePage() {
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await apiGet<EventType[]>("/api/event-types/people");
//         setEvents(data);
//       } catch (e) {
//         setError(
//           e instanceof Error ? e.message : "Failed to load event types",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="neo-shell">
//       <main className="neo-main">
//         <section
//           className="neo-content-card"
//           style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
//         >
//           <h1 className="neo-section-title">Choose your host</h1>
//           <p className="neo-hero-sub">
//             Start by picking the event you want to book. Each one represents a
//             specific person and meeting type.
//           </p>

//           <div style={{ marginTop: 8, marginBottom: 8 }}>
//             <Link href="/people/new" className="neo-button">
//               + Add new person
//             </Link>
//           </div>

//           {loading && <p>Loading people…</p>}
//           {error && <div className="neo-error">{error}</div>}

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//               gap: 16,
//               marginTop: 16,
//             }}
//           >
//             {events.map((ev) => (
//               <div key={ev.id} className="neo-person-card">
//                 <div className="neo-person-name">{ev.title}</div>
//                 <div className="neo-person-role">
//                   {ev.durationMinutes} minute meeting
//                 </div>
//                 <p className="neo-person-highlight">{ev.description}</p>
//                 <Link href={`/book/${ev.slug}`} className="neo-button">
//                   Book {ev.durationMinutes} min
//                 </Link>
//               </div>
//             ))}
//             {!loading && events.length === 0 && (
//               <p style={{ fontWeight: 600 }}>
//                 No event types created yet. Create one in the dashboard.
//               </p>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


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

const AVATAR_COLORS = [
  "#4f46e5", "#0891b2", "#059669", "#d97706",
  "#dc2626", "#7c3aed", "#db2777", "#0284c7",
];

function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

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
        setError(e instanceof Error ? e.message : "Failed to load event types");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Page header */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "24px 32px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            People
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280" }}>
            Pick the person and meeting type you want to book.
          </p>
        </div>

        <Link
          href="/people/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#111827",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add person
        </Link>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px" }}>
        {loading && (
          <div style={{ display: "flex", gap: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 calc(25% - 12px)",
                  height: 180,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 6,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              color: "#dc2626",
              fontSize: 13.5,
            }}
          >
            {error}
          </div>
        )}

        {!loading && events.length === 0 && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: "#6b7280",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: "0 auto 16px" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No people added yet</p>
            <p style={{ fontSize: 13 }}>Add someone to get started.</p>
          </div>
        )}

        {/* 4-column grid — fixed columns, not auto-fit */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {events.map((ev, index) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                transition: "box-shadow 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar name={ev.title} index={index} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                    {ev.title}
                  </div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                    fontSize: 11.5,
                    color: "#6b7280",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: 4,
                    padding: "2px 7px",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {ev.durationMinutes}m
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "#f3f4f6", marginBottom: 14 }} />

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  flex: 1,
                  marginBottom: 16,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ev.description || "No description provided."}
              </p>

              {/* Book button */}
              <Link
                href={`/book/${ev.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  backgroundColor: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 6,
                  padding: "9px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
              >
                Book {ev.durationMinutes} min
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}