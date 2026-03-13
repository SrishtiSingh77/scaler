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
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
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
        bufferBeforeMinutes: form.bufferBeforeMinutes,
        bufferAfterMinutes: form.bufferAfterMinutes,
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
          style={{
            gridColumn: "1 / span 2",
            background: "#ffffff",
          }}
        >
          <h1 className="neo-section-title">Add a new person</h1>
          <p className="neo-hero-sub">
            Create a personal booking template with its own link, duration, buffers,
            and availability schedule.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5 text-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column: identity */}
              <div className="space-y-3">
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
                    placeholder="e.g. Srishti Singh"
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
                    placeholder="e.g. Product Designer, SDR, Founder"
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
                    placeholder="e.g. srishti-intro-call"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Booking link will be <code className="bg-gray-100 px-1">/book/{form.slug || "your-slug"}</code>
                  </p>
                </div>
              </div>

              {/* Right column: timing + schedule */}
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="neo-field">
                    <label className="neo-label" htmlFor="duration">
                      Duration (min)
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
                    <label className="neo-label" htmlFor="buffer-before">
                      Buffer before
                    </label>
                    <input
                      id="buffer-before"
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
                    <label className="neo-label" htmlFor="buffer-after">
                      Buffer after
                    </label>
                    <input
                      id="buffer-after"
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
                  <p className="mt-1 text-[11px] text-gray-500">
                    Manage schedules under <span className="font-medium">Dashboard → Availability</span>.
                  </p>
                </div>

                <div className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-600">
                  <span className="font-semibold text-gray-800">Session block:</span>{" "}
                  {form.durationMinutes +
                    form.bufferBeforeMinutes +
                    form.bufferAfterMinutes}{" "}
                  minutes (duration + buffers)
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-md bg-black px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={
                  loading || !form.name || !form.role || !form.slug || !form.scheduleId
                }
              >
                {loading ? "Saving…" : "Create person"}
              </button>
            </div>
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