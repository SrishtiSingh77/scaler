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

function StatusPill({ status }: { status: string }) {
  const configs: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    ACCEPTED: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e", label: "Confirmed" },
    PENDING: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", label: "Pending" },
    CANCELLED: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444", label: "Cancelled" },
  };
  const cfg = configs[status] ?? { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: status };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      backgroundColor: cfg.bg, color: cfg.color,
      borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot }} />
      {cfg.label}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      backgroundColor: "#e0e7ff",
      color: "#4f46e5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

export default function BookingsDashboardPage() {
  const [scope, setScope] = useState<Scope>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadBookings(nextScope: Scope = scope) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Booking[]>(`/api/bookings?scope=${encodeURIComponent(nextScope)}`);
      setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBookings("upcoming"); }, []);

  const tabs: { key: Scope; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "all", label: "All bookings" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Page header */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "24px 32px",
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Bookings</h1>
        <p style={{ fontSize: 13.5, color: "#6b7280" }}>
          View and manage upcoming and past meetings.
        </p>
      </div>

      <div style={{ padding: "24px 32px" }}>
        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #e5e7eb",
          marginBottom: 20,
        }}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setScope(key); loadBookings(key); }}
              style={{
                padding: "10px 18px",
                fontSize: 13.5,
                fontWeight: scope === key ? 600 : 400,
                color: scope === key ? "#111827" : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: scope === key ? "2px solid #111827" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            padding: "12px 16px", marginBottom: 16,
            backgroundColor: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 6, color: "#dc2626", fontSize: 13.5,
          }}>
            {error}
          </div>
        )}

        {/* Table card */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.5fr 120px 100px",
            padding: "10px 20px",
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            gap: 16,
          }}>
            {["Title", "Date & Time", "Attendee", "Status", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11.5, fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Loading skeletons */}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1.5fr 120px 100px",
              padding: "16px 20px",
              borderBottom: "1px solid #f3f4f6",
              gap: 16,
              alignItems: "center",
            }}>
              {[180, 140, 150, 80, 70].map((w, j) => (
                <div key={j} style={{
                  height: 14, width: w, borderRadius: 4,
                  backgroundColor: "#f3f4f6",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
              ))}
            </div>
          ))}

          {/* Empty state */}
          {!loading && bookings.length === 0 && (
            <div style={{ padding: "56px 24px", textAlign: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: "0 auto 14px", display: "block" }}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No bookings found</p>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                {scope === "upcoming" ? "No upcoming meetings scheduled." : scope === "past" ? "No past meetings found." : "No bookings yet."}
              </p>
            </div>
          )}

          {/* Rows */}
          {!loading && bookings.map((bk, index) => {
            const { date, time } = formatDate(bk.startTime);
            const isCancelled = bk.status === "CANCELLED";
            const isCancelling = cancellingId === bk.id;

            return (
              <div
                key={bk.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1.5fr 120px 100px",
                  padding: "14px 20px",
                  borderBottom: index < bookings.length - 1 ? "1px solid #f3f4f6" : "none",
                  gap: 16,
                  alignItems: "center",
                  backgroundColor: "#fff",
                  transition: "background 0.1s",
                  opacity: isCancelled ? 0.65 : 1,
                }}
                onMouseEnter={e => { if (!isCancelled) e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                {/* Title */}
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
                    {bk.eventType?.title ?? "Meeting"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>#{bk.id.slice(0, 8)}</div>
                </div>

                {/* Date */}
                <div>
                  <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{date}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{time}</div>
                </div>

                {/* Attendee */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={bk.bookerName} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{bk.bookerName}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{bk.bookerEmail}</div>
                  </div>
                </div>

                {/* Status */}
                <div><StatusPill status={bk.status} /></div>

                {/* Cancel */}
                <div>
                  {!isCancelled && (
                    <button
                      type="button"
                      disabled={isCancelling}
                      onClick={async () => {
                        setCancellingId(bk.id);
                        try {
                          await apiPostVoid(`/api/bookings/${bk.id}/cancel`);
                          await loadBookings();
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Failed to cancel");
                        } finally {
                          setCancellingId(null);
                        }
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid #fecaca",
                        backgroundColor: isCancelling ? "#f9fafb" : "#fff",
                        color: "#dc2626",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: isCancelling ? "not-allowed" : "pointer",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => { if (!isCancelling) { e.currentTarget.style.backgroundColor = "#fef2f2"; } }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; }}
                    >
                      {isCancelling ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        {!loading && bookings.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12.5, color: "#9ca3af", textAlign: "right" }}>
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}