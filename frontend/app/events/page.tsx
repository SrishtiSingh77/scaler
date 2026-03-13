"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "../api-client";

type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  slug: string;
};

type DetailedEventType = EventType & {
  bufferBeforeMinutes?: number | null;
  bufferAfterMinutes?: number | null;
  isPerson?: boolean | null;
  schedules?: { schedule: { id: string } }[];
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        border: "none",
        backgroundColor: enabled ? "#111827" : "#d1d5db",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s ease",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 3,
        left: enabled ? 21 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: "#fff",
        transition: "left 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function IconBtn({
  title,
  children,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [menuForId, setMenuForId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet<EventType[]>("/api/event-types/events");
        setEvents(data);
        const map: Record<string, boolean> = {};
        data.forEach((ev, i) => { map[ev.id] = i !== 0; }); // first one hidden by default
        setEnabledMap(map);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load event types");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEvents = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase())
  );

  async function refreshEvents() {
    const data = await apiGet<EventType[]>("/api/event-types/events");
    setEvents(data);
  }

  async function handleDuplicate(ev: EventType) {
    try {
      const detail = await apiGet<DetailedEventType>(`/api/event-types/${ev.id}`);
      const scheduleId =
        detail.schedules && detail.schedules[0]?.schedule?.id
          ? detail.schedules[0].schedule.id
          : undefined;
      if (!scheduleId) {
        setError("Cannot duplicate event without an availability schedule");
        return;
      }

      const existingSlugs = new Set(events.map((e) => e.slug));
      const baseSlug = detail.slug;
      let newSlug = `${baseSlug}-copy`;
      let i = 1;
      while (existingSlugs.has(newSlug)) {
        newSlug = `${baseSlug}-copy-${i}`;
        i += 1;
      }

      await apiPost("/api/event-types", {
        title: `${detail.title} (Copy)`,
        description: detail.description,
        durationMinutes: detail.durationMinutes,
        bufferBeforeMinutes: detail.bufferBeforeMinutes ?? 0,
        bufferAfterMinutes: detail.bufferAfterMinutes ?? 0,
        slug: newSlug,
        scheduleId,
        isPerson: detail.isPerson ?? false,
      });
      await refreshEvents();
      setMenuForId(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to duplicate event type",
      );
    }
  }

  async function handleDelete(ev: EventType) {
    try {
      await apiDelete(`/api/event-types/${ev.id}`);
      await refreshEvents();
      setMenuForId(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to delete event type",
      );
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 32px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fff",
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            Event types
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280" }}>
            Configure different events for people to book on your calendar.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "8px 12px 8px 32px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13.5,
                color: "#374151",
                outline: "none",
                width: 220,
                backgroundColor: "#fff",
              }}
            />
          </div>

          {/* New button */}
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New
          </button>
        </div>
      </div>

      {/* Event list */}
      <div style={{ padding: "24px 32px" }}>
        {loading && <p style={{ color: "#6b7280", fontSize: 14 }}>Loading events…</p>}
        {error && (
          <div style={{ color: "#dc2626", fontSize: 14, padding: "12px 16px", backgroundColor: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && !error && (
          <p style={{ color: "#6b7280", fontSize: 14 }}>No event types found.</p>
        )}

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}>
          {filteredEvents.map((ev, index) => {
            const isEnabled = enabledMap[ev.id] ?? true;
            const isHidden = !isEnabled;

            return (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: index < filteredEvents.length - 1 ? "1px solid #f3f4f6" : "none",
                  transition: "background 0.15s",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                {/* Left: title + badge */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: "#111827" }}>
                      {ev.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                      /{ev.slug}
                    </span>
                  </div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 12,
                    color: "#374151",
                    backgroundColor: "#f9fafb",
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {ev.durationMinutes}m
                  </div>
                </div>

                {/* Right: controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {isHidden && (
                    <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Hidden</span>
                  )}

                  <Toggle
                    enabled={isEnabled}
                    onChange={() => setEnabledMap(prev => ({ ...prev, [ev.id]: !prev[ev.id] }))}
                  />

                  {/* Open */}
                  <Link href={`/book/${ev.slug}`}>
                    <IconBtn title="Open booking page">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </IconBtn>
                  </Link>

                  {/* Copy link */}
                  <IconBtn title="Copy link">
                    <button
                      type="button"
                      onClick={async () => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "";
                        const url = `${origin}/book/${ev.slug}`;
                        try {
                          await navigator.clipboard.writeText(url);
                          setCopiedSlug(ev.slug);
                          setTimeout(() => setCopiedSlug(null), 1500);
                        } catch { }
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", color: copiedSlug === ev.slug ? "#16a34a" : "#6b7280" }}
                      title="Copy link"
                    >
                      {copiedSlug === ev.slug ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      )}
                    </button>
                  </IconBtn>

                  {/* More options */}
                  <div style={{ position: "relative" }}>
                    <IconBtn
                      title="More options"
                      onClick={() =>
                        setMenuForId((current) =>
                          current === ev.id ? null : ev.id,
                        )
                      }
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </IconBtn>
                    {menuForId === ev.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "120%",
                          right: 0,
                          backgroundColor: "#ffffff",
                          borderRadius: 8,
                          boxShadow: "0 12px 30px rgba(15,23,42,0.2)",
                          border: "1px solid #e5e7eb",
                          padding: "4px 0",
                          minWidth: 140,
                          zIndex: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleDuplicate(ev)}
                          style={{
                            width: "100%",
                            padding: "6px 12px",
                            fontSize: 12.5,
                            textAlign: "left",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#111827",
                          }}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ev)}
                          style={{
                            width: "100%",
                            padding: "6px 12px",
                            fontSize: 12.5,
                            textAlign: "left",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#b91c1c",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}