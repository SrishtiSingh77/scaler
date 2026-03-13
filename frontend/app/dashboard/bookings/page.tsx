"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPostVoid } from "../../api-client";
import { useToast } from "../../ToastProvider";

type Booking = {
    id: string;
    bookerName: string;
    bookerEmail: string;
    startTime: string;
    status: string;
    eventType: {
        title: string;
    } | null;
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    async function loadBookings() {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet<Booking[]>("/api/bookings?scope=upcoming");
            setBookings(data);
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to load bookings";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function cancelBooking(id: string) {
        setLoading(true);
        setError(null);
        try {
            await apiPostVoid(`/api/bookings/${id}/cancel`);
            showToast("Booking cancelled", "success");
            await loadBookings();
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to cancel booking";
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
                    <Link href="/dashboard/event-types" className="neo-sidebar-link">
                        Event Types
                    </Link>
                    <Link href="/dashboard/availability" className="neo-sidebar-link">
                        Availability
                    </Link>
                    <Link href="/dashboard/bookings" className="neo-sidebar-link active">
                        Bookings
                    </Link>
                </aside>

                <section className="neo-content-card">
                    <header className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="neo-section-title">Bookings</h1>
                            <p className="neo-section-subtitle">
                                See all upcoming meetings, who booked them, and quickly cancel if
                                needed.
                            </p>
                        </div>
                    </header>

                    {error && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        {bookings.map((bk) => {
                            const date = new Date(bk.startTime);
                            const dateLabel = date.toLocaleDateString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            });
                            const timeLabel = date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            const statusColor =
                                bk.status === "CONFIRMED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : bk.status === "PENDING"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-gray-100 text-gray-600 border-gray-200";

                            return (
                                <div
                                    key={bk.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs shadow-sm"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {bk.eventType?.title ?? "Event"}
                                            </span>
                                            <span
                                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor}`}
                                            >
                                                {bk.status}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-600">
                                            {dateLabel} · {timeLabel}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {bk.bookerName} · {bk.bookerEmail}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {bk.status !== "CANCELLED" && (
                                            <button
                                                type="button"
                                                className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-300 bg-white hover:bg-red-50 transition-colors rounded-md"
                                                onClick={() => cancelBooking(bk.id)}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {bookings.length === 0 && !loading && (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
                                No upcoming bookings yet. Share your{" "}
                                <Link
                                    href="/dashboard/event-types"
                                    className="text-gray-700 underline-offset-2 hover:underline"
                                >
                                    event type links
                                </Link>{" "}
                                to start receiving meetings.
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="mt-3 text-xs text-gray-400">Refreshing bookings…</div>
                    )}
                </section>
            </main>
        </div>
    );
}