
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api-client";

type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  slug: string;
};

type Schedule = {
  id: string;
  name: string;
  timezone: string;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: "#111827",
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    durationMinutes: 30,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    slug: "",
    scheduleId: "",
  });

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

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await apiGet<Schedule[]>("/api/availability/schedules");
        setSchedules(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, scheduleId: data[0].id }));
        }
      } catch {
        // ignore schedule errors here; form will still render
      }
    }
    loadSchedules();
  }, []);

  const canSubmit =
    !!form.name.trim() &&
    !!form.role.trim() &&
    !!form.slug.trim() &&
    !!form.scheduleId.trim();

  async function handleCreatePerson(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setCreating(true);
    try {
      await apiPost("/api/event-types", {
        title: form.name,
        description: form.role,
        durationMinutes: form.durationMinutes,
        bufferBeforeMinutes: form.bufferBeforeMinutes,
        bufferAfterMinutes: form.bufferAfterMinutes,
        slug: form.slug,
        scheduleId: form.scheduleId,
        isPerson: true,
      });
      // reset a bit and close
      setForm((prev) => ({
        ...prev,
        name: "",
        role: "",
        slug: "",
      }));
      setShowModal(false);
      // refresh list
      const data = await apiGet<EventType[]>("/api/event-types/people");
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create person event");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Page header */}
      <div
        style={{
          backgroundColor: "#fff",
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

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add person
        </button>
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
                  backgroundColor: "white",
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
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 10,
                padding: "18px 18px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
                border: "3px solid #e5e7eb",
                transition:
                  "box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(15,23,42,0.12)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.borderColor = "#cbd5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 3px 10px rgba(15,23,42,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar name={ev.title} />
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

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !creating) {
              setShowModal(false);
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 720,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
              padding: "20px 22px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 2,
                  }}
                >
                  Add a new person
                </h2>
                <p style={{ fontSize: 12.5, color: "#6b7280" }}>
                  Create a personal booking template with duration, buffers, and schedule.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !creating && setShowModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: creating ? "default" : "pointer",
                  padding: 4,
                  color: "#9ca3af",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreatePerson} style={{ fontSize: 13 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1.1fr",
                  gap: 18,
                  marginTop: 6,
                  marginBottom: 14,
                }}
              >
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="modal-name">
                      Person name
                    </label>
                    <input
                      id="modal-name"
                      className="neo-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Srishti Singh"
                    />
                  </div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="modal-role">
                      Short description / role
                    </label>
                    <input
                      id="modal-role"
                      className="neo-input"
                      value={form.role}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="e.g. Product Designer, SDR, Founder"
                    />
                  </div>
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="modal-slug">
                      URL slug (unique)
                    </label>
                    <input
                      id="modal-slug"
                      className="neo-input"
                      value={form.slug}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="e.g. srishti-intro-call"
                    />
                    <p style={{ marginTop: 4, fontSize: 11, color: "#6b7280" }}>
                      Booking link will be{" "}
                      <code style={{ background: "#f3f4f6", padding: "0 4px" }}>
                        /book/{form.slug || "your-slug"}
                      </code>
                    </p>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                      gap: 10,
                    }}
                  >
                    <div className="neo-field">
                      <label className="neo-label" htmlFor="modal-duration">
                        Duration (min)
                      </label>
                      <input
                        id="modal-duration"
                        type="number"
                        min={5}
                        className="neo-input"
                        value={form.durationMinutes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            durationMinutes: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="neo-field">
                      <label className="neo-label" htmlFor="modal-buffer-before">
                        Buffer before
                      </label>
                      <input
                        id="modal-buffer-before"
                        type="number"
                        min={0}
                        className="neo-input"
                        value={form.bufferBeforeMinutes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            bufferBeforeMinutes: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="neo-field">
                      <label className="neo-label" htmlFor="modal-buffer-after">
                        Buffer after
                      </label>
                      <input
                        id="modal-buffer-after"
                        type="number"
                        min={0}
                        className="neo-input"
                        value={form.bufferAfterMinutes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            bufferAfterMinutes: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="neo-field">
                    <label className="neo-label" htmlFor="modal-schedule">
                      Availability schedule
                    </label>
                    <select
                      id="modal-schedule"
                      className="neo-input"
                      value={form.scheduleId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, scheduleId: e.target.value }))
                      }
                    >
                      <option value="">Select schedule…</option>
                      {schedules.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.timezone})
                        </option>
                      ))}
                    </select>
                    <p style={{ marginTop: 4, fontSize: 11, color: "#6b7280" }}>
                      Manage schedules under{" "}
                      <span style={{ fontWeight: 600 }}>Dashboard → Availability</span>.
                    </p>
                  </div>

                  <div
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      padding: "8px 10px",
                      fontSize: 11,
                      color: "#4b5563",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      Session block:
                    </span>{" "}
                    {form.durationMinutes +
                      form.bufferBeforeMinutes +
                      form.bufferAfterMinutes}{" "}
                    minutes (duration + buffers)
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => !creating && setShowModal(false)}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    padding: "7px 14px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#4b5563",
                    cursor: creating ? "default" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !canSubmit}
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "7px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor:
                      creating || !canSubmit ? "#9ca3af" : "#111827",
                    color: "#ffffff",
                    cursor: creating || !canSubmit ? "not-allowed" : "pointer",
                  }}
                >
                  {creating ? "Creating…" : "Create person"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}