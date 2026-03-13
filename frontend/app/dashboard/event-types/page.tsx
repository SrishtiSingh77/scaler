"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiDelete, apiGet, apiPost, apiPut } from "../../api-client";
import { useToast } from "../../ToastProvider";
import type { BackendSchedule } from "../_components/AvailabilityEditor";

type EventType = {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    bufferBeforeMinutes: number;
    bufferAfterMinutes: number;
    slug: string;
};

export default function EventTypesPage() {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [schedules, setSchedules] = useState<BackendSchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        durationMinutes: 30,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        slug: "",
        scheduleId: "",
    });

    const { showToast } = useToast();

    async function loadEventTypes() {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet<EventType[]>("/api/event-types");
            setEventTypes(data);
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to load event types";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    async function loadSchedules() {
        try {
            const data = await apiGet<BackendSchedule[]>("/api/availability/schedules");
            setSchedules(data);
            if (!form.scheduleId && data.length > 0) {
                setForm((prev) => ({ ...prev, scheduleId: data[0].id }));
            }
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to load schedules";
            setError(msg);
            showToast(msg, "error");
        }
    }

    useEffect(() => {
        loadEventTypes();
        loadSchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isValid =
        !!form.title.trim() && !!form.slug.trim() && !!form.scheduleId.trim();

    async function handleSave() {
        if (!isValid) return;
        setLoading(true);
        setError(null);
        try {
            if (editingId) {
                await apiPut(`/api/event-types/${editingId}`, form);
                showToast("Event type updated", "success");
            } else {
                await apiPost("/api/event-types", form);
                showToast("Event type created", "success");
            }
            setForm((prev) => ({
                ...prev,
                title: "",
                description: "",
                slug: "",
            }));
            setEditingId(null);
            await loadEventTypes();
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to save event type";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="neo-shell">
            <main className="neo-main">
                <aside className="neo-sidebar">
                    <div className="neo-sidebar-title">Dashboard</div>
                    <Link href="/dashboard/event-types" className="neo-sidebar-link active">
                        Event Types
                    </Link>
                    <Link href="/dashboard/availability" className="neo-sidebar-link">
                        Availability
                    </Link>
                    <Link href="/dashboard/bookings" className="neo-sidebar-link">
                        Bookings
                    </Link>
                </aside>

                <section className="neo-content-card">
                    <header className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="neo-section-title">Event types</h1>
                            <p className="neo-section-subtitle">
                                Design the meeting templates your invitees can book, including duration,
                                buffers, and which availability schedule they should use.
                            </p>
                        </div>
                    </header>

                    {error && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
                        {/* Left: form */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {editingId ? "Edit event type" : "Create a new event type"}
                                </h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                        onClick={() => {
                                            setEditingId(null);
                                            setForm((prev) => ({
                                                ...prev,
                                                title: "",
                                                description: "",
                                                slug: "",
                                            }));
                                        }}
                                    >
                                        Cancel edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="neo-field">
                                    <label className="neo-label" htmlFor="et-title">
                                        Title
                                    </label>
                                    <input
                                        id="et-title"
                                        className="neo-input"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, title: e.target.value }))
                                        }
                                        placeholder="Intro call, Product demo, Strategy session…"
                                    />
                                </div>
                                <div className="neo-field">
                                    <label className="neo-label" htmlFor="et-desc">
                                        Description
                                    </label>
                                    <input
                                        id="et-desc"
                                        className="neo-input"
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Optional short description shown on the booking page"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="neo-field">
                                        <label className="neo-label" htmlFor="et-duration">
                                            Duration (min)
                                        </label>
                                        <input
                                            id="et-duration"
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
                                        <label className="neo-label" htmlFor="et-buffer-before">
                                            Buffer before
                                        </label>
                                        <input
                                            id="et-buffer-before"
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
                                        <label className="neo-label" htmlFor="et-buffer-after">
                                            Buffer after
                                        </label>
                                        <input
                                            id="et-buffer-after"
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

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="neo-field">
                                        <label className="neo-label" htmlFor="et-slug">
                                            URL slug
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <span className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                                                /book/
                                            </span>
                                            <input
                                                id="et-slug"
                                                className="neo-input"
                                                value={form.slug}
                                                onChange={(e) =>
                                                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                                                }
                                                placeholder="intro-call"
                                            />
                                        </div>
                                    </div>
                                    <div className="neo-field">
                                        <label className="neo-label" htmlFor="et-schedule">
                                            Availability schedule
                                        </label>
                                        <select
                                            id="et-schedule"
                                            className="neo-input"
                                            value={form.scheduleId}
                                            onChange={(e) =>
                                                setForm((prev) => ({
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
                                </div>

                                <div className="mt-4 flex justify-between text-[11px] text-gray-500">
                                    <span>
                                        Booking link preview:{" "}
                                        {form.slug ? (
                                            <code className="rounded bg-gray-100 px-1.5 py-0.5">
                                                /book/{form.slug}
                                            </code>
                                        ) : (
                                            <span className="italic text-gray-400">add a slug</span>
                                        )}
                                    </span>
                                    <span>
                                        Duration + buffers:{" "}
                                        <strong>
                                            {form.durationMinutes +
                                                form.bufferBeforeMinutes +
                                                form.bufferAfterMinutes}
                                            {" min block"}
                                        </strong>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-md bg-black px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                                    disabled={loading || !isValid}
                                    onClick={handleSave}
                                >
                                    {editingId ? "Update event type" : "Create event type"}
                                </button>
                            </div>
                        </div>

                        {/* Right: existing types */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Your event types
                                </h2>
                                <span className="text-[11px] text-gray-400">
                                    {eventTypes.length} total
                                </span>
                            </div>

                            <div className="space-y-3">
                                {eventTypes.map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                                    >
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {ev.title}
                                                </span>
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                    {ev.durationMinutes}m
                                                </span>
                                            </div>
                                            {ev.description && (
                                                <p className="text-[11px] text-gray-500">
                                                    {ev.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                                                <span>
                                                    Buffer: {ev.bufferBeforeMinutes}m before ·{" "}
                                                    {ev.bufferAfterMinutes}m after
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>
                                                    Link:{" "}
                                                    <code className="rounded bg-gray-100 px-1.5 py-0.5">
                                                        /book/{ev.slug}
                                                    </code>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-900 transition-colors rounded-md"
                                                    onClick={() => {
                                                        setEditingId(ev.id);
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            title: ev.title,
                                                            description: ev.description,
                                                            durationMinutes: ev.durationMinutes,
                                                            bufferBeforeMinutes: ev.bufferBeforeMinutes,
                                                            bufferAfterMinutes: ev.bufferAfterMinutes,
                                                            slug: ev.slug,
                                                        }));
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-300 bg-white hover:bg-red-50 transition-colors"
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        setError(null);
                                                        try {
                                                            await apiDelete(`/api/event-types/${ev.id}`);
                                                            showToast("Event type deleted", "success");
                                                            await loadEventTypes();
                                                        } catch (e) {
                                                            const msg =
                                                                e instanceof Error
                                                                    ? e.message
                                                                    : "Failed to delete event type";
                                                            setError(msg);
                                                            showToast(msg, "error");
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <Link
                                                href={`/book/${ev.slug}`}
                                                className="text-[11px] text-gray-500 underline-offset-2 hover:underline"
                                                target="_blank"
                                            >
                                                Open public booking page
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {eventTypes.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
                                        No event types yet. Start by creating your first template on the
                                        left.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}