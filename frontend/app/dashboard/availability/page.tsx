"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "../../api-client";
import { useToast } from "../../ToastProvider";
import {
    AvailabilityEditor,
    type BackendSchedule,
} from "../_components/AvailabilityEditor";

export default function AvailabilityPage() {
    const [schedules, setSchedules] = useState<BackendSchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    async function loadSchedules() {
        setLoading(true);
        setError(null);
        try {
            const data = await apiGet<BackendSchedule[]>("/api/availability/schedules");
            setSchedules(data);
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to load schedules";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const primary = schedules[0] ?? null;

    return (
        <div className="neo-shell">
            <main className="neo-main">
                <aside className="neo-sidebar">
                    <div className="neo-sidebar-title">Dashboard</div>
                    <Link href="/dashboard/event-types" className="neo-sidebar-link">
                        Event Types
                    </Link>
                    <Link href="/dashboard/availability" className="neo-sidebar-link active">
                        Availability
                    </Link>
                    <Link href="/dashboard/bookings" className="neo-sidebar-link">
                        Bookings
                    </Link>
                </aside>

                <section className="neo-content-card">
                    <header className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="neo-section-title">Availability</h1>
                            <p className="neo-section-subtitle">
                                Define your working hours and exceptions. Event types will use this
                                schedule when generating slots.
                            </p>
                        </div>
                        {primary && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
                                <div className="font-semibold">Active schedule</div>
                                <div>
                                    {primary.name} · {primary.timezone}
                                </div>
                            </div>
                        )}
                    </header>

                    {error && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    <AvailabilityEditor onCreated={loadSchedules} existingSchedule={primary} />

                    {loading && (
                        <div className="mt-3 text-xs text-gray-400">Refreshing schedules…</div>
                    )}
                </section>
            </main>
        </div>
    );
}