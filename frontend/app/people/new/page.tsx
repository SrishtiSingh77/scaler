"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api-client";

type Schedule = {
  id: string;
  name: string;
  timezone: string;
};

export default function NewPersonPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    durationMinutes: 30,
    slug: "",
    scheduleId: "",
  });

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await apiGet<Schedule[]>("/api/availability/schedules");
        setSchedules(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, scheduleId: data[0].id }));
        }
      } catch {
        // ignore schedule load errors here; booking flows will surface issues
      }
    }
    loadSchedules();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      await apiPost("/api/event-types", {
        title: form.name,
        description: form.role,
        durationMinutes: form.durationMinutes,
        slug: form.slug,
        scheduleId: form.scheduleId,
        isPerson: true,
      });
      setSuccess("Person event created. It will appear on the People page.");
      setForm((prev) => ({
        ...prev,
        name: "",
        role: "",
        slug: "",
      }));
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to create person event";
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neo-shell">
      <main className="neo-main">
        <section
          className="neo-content-card"
          style={{ gridColumn: "1 / span 2", background: "#fffdf5" }}
        >
          <h1 className="neo-section-title">Add a new person</h1>
          <p className="neo-hero-sub">
            This creates an underlying event type in the database that will show
            up on the People and Events pages with its own public booking link.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="neo-field">
              <label className="neo-label" htmlFor="name">
                Person name
              </label>
              <input
                id="name"
                className="neo-input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="neo-field">
              <label className="neo-label" htmlFor="role">
                Short description / role
              </label>
              <input
                id="role"
                className="neo-input"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, role: e.target.value }))
                }
              />
            </div>
            <div className="neo-field">
              <label className="neo-label" htmlFor="duration">
                Duration (minutes)
              </label>
              <input
                id="duration"
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
              <label className="neo-label" htmlFor="slug">
                URL slug (unique)
              </label>
              <input
                id="slug"
                className="neo-input"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
            </div>
            <div className="neo-field">
              <label className="neo-label" htmlFor="schedule">
                Availability schedule
              </label>
              <select
                id="schedule"
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
            </div>

            <button
              type="submit"
              className="neo-button"
              disabled={
                loading || !form.name || !form.role || !form.slug || !form.scheduleId
              }
            >
              {loading ? "Saving…" : "Create person"}
            </button>
          </form>

          {success && <div className="neo-success">{success}</div>}
        </section>
      </main>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 50,
          }}
        >
          <div className="neo-error">{toast}</div>
        </div>
      )}
    </div>
  );
}

