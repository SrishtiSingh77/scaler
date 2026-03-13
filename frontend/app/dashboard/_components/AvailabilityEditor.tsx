/* Availability editor and helpers extracted from the main dashboard page */
"use client";

import { useEffect, useState } from "react";
import { apiPost, apiPut } from "../../api-client";
import { useToast } from "../../ToastProvider";

type TimeRange = { start: string; end: string };
type DayKey =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";
type DaySchedule = { enabled: boolean; ranges: TimeRange[] };

export type BackendOverride = {
    id: string;
    date: string;
    isBlocked: boolean;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
};

export type BackendSchedule = {
    id: string;
    name: string;
    timezone: string;
    overrides?: BackendOverride[];
};

const DAY_KEYS: DayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const DAY_LABELS: Record<DayKey, string> = {
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
};

const TIMEZONES = [
    "Asia/Kolkata",
    "Europe/London",
    "Europe/Amsterdam",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Asia/Tokyo",
];

const TIMES: string[] = [];
for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += 30) {
        const hh = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? "am" : "pm";
        TIMES.push(`${hh}:${m === 0 ? "00" : "30"}${ampm}`);
    }
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
}

function getFirstDay(y: number, m: number) {
    return new Date(y, m, 1).getDay();
}

function toIso(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(
        2,
        "0",
    )}`;
}

function fmtDate(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function parseTimeToMinutes(label: string): number {
    const match = label.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (!match) return 0;
    const [, hStr, mStr, ampm] = match;
    const m = Number(mStr);
    let h = Number(hStr);
    const lower = ampm.toLowerCase();
    if (lower === "pm" && h !== 12) h += 12;
    if (lower === "am" && h === 12) h = 0;
    return h * 60 + m;
}

function minutesToLabel(total: number): string {
    const h = Math.floor(total / 60);
    const m = total % 60;
    const hh = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "am" : "pm";
    return `${hh}:${m === 0 ? "00" : String(m).padStart(2, "0")}${ampm}`;
}

function TimeSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <select
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {TIMES.map((t) => (
                <option key={t} value={t}>
                    {t}
                </option>
            ))}
        </select>
    );
}

type DateOverride = {
    id: string;
    date: string;
    unavailable: boolean;
    ranges: TimeRange[];
};

function OverrideModal({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: (override: Omit<DateOverride, "id">) => void;
}) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [unavailable, setUnavailable] = useState(false);
    const [ranges, setRanges] = useState<TimeRange[]>([
        { start: "9:00am", end: "5:00pm" },
    ]);

    const prevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);
    const todayIso = toIso(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );

    const handleSave = () => {
        if (!selectedDate) return;
        onSave({ date: selectedDate, unavailable, ranges });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="grid w-[720px] max-w-[95vw] grid-cols-[1fr_1px_1fr] overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Left: calendar */}
                <div className="px-7 py-8">
                    <h2 className="mb-6 text-lg font-semibold text-gray-900">
                        Select the dates to override
                    </h2>

                    <div className="mb-5 flex items-center gap-3">
                        <span className="text-base font-semibold text-gray-900">
                            {MONTHS[month]}{" "}
                            <span className="text-sm font-normal text-gray-400">{year}</span>
                        </span>
                        <div className="ml-auto flex gap-2">
                            {[
                                { dir: "left" as const, fn: prevMonth },
                                { dir: "right" as const, fn: nextMonth },
                            ].map(({ dir, fn }) => (
                                <button
                                    key={dir}
                                    type="button"
                                    onClick={fn}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        {dir === "left" ? (
                                            <polyline points="15 18 9 12 15 6" />
                                        ) : (
                                            <polyline points="9 18 15 12 9 6" />
                                        )}
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold tracking-[0.08em] text-gray-400">
                        {WEEKDAYS_SHORT.map((d) => (
                            <div key={d} className="py-0.5">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-xs">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`e-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const iso = toIso(year, month, day);
                            const isPast = iso < todayIso;
                            const isSelected = iso === selectedDate;
                            const isToday = iso === todayIso;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => setSelectedDate(iso)}
                                    className={`relative flex h-9 items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${isSelected
                                            ? "bg-gray-900 text-white"
                                            : isPast
                                                ? "text-gray-300"
                                                : "bg-gray-50 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    {day}
                                    {isToday && (
                                        <span
                                            className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-gray-900"
                                                }`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gray-200" />

                {/* Right: hours */}
                <div className="flex flex-col px-7 py-8">
                    <div className="flex-1">
                        <h3 className="mb-5 text-sm font-semibold text-gray-900">
                            Which hours are you free?
                        </h3>

                        <div
                            className={`mb-5 flex flex-col gap-2.5 ${unavailable ? "opacity-40" : ""
                                }`}
                        >
                            {ranges.map((range, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-wrap items-center gap-2 text-xs"
                                >
                                    <TimeSelect
                                        value={range.start}
                                        onChange={(v) => {
                                            const next = [...ranges];
                                            next[idx] = { ...next[idx], start: v };
                                            setRanges(next);
                                        }}
                                    />
                                    <span className="text-base text-gray-300">–</span>
                                    <TimeSelect
                                        value={range.end}
                                        onChange={(v) => {
                                            const next = [...ranges];
                                            next[idx] = { ...next[idx], end: v };
                                            setRanges(next);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        disabled={unavailable}
                                        onClick={() => {
                                            if (idx === ranges.length - 1) {
                                                setRanges([
                                                    ...ranges,
                                                    { start: "9:00am", end: "5:00pm" },
                                                ]);
                                            } else {
                                                setRanges(ranges.filter((_, i) => i !== idx));
                                            }
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed"
                                    >
                                        {idx === ranges.length - 1 ? "+" : "–"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setUnavailable((v) => !v)}
                            className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-700"
                        >
                            <span
                                className={`flex h-5 w-9 items-center rounded-full border transition-colors ${unavailable
                                        ? "border-gray-900 bg-gray-900"
                                        : "border-gray-300 bg-gray-200"
                                    }`}
                            >
                                <span
                                    className={`ml-1 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${unavailable ? "translate-x-4" : ""
                                        }`}
                                />
                            </span>
                            <span className="font-medium">Mark unavailable (All day)</span>
                        </button>

                        {selectedDate && (
                            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                                <span className="font-semibold">{fmtDate(selectedDate)}</span>
                                {" — "}
                                <span className="text-gray-500">
                                    {unavailable
                                        ? "Marked as unavailable"
                                        : `${ranges[0].start} – ${ranges[ranges.length - 1].end
                                        }`}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-3 text-xs">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            disabled={!selectedDate}
                            onClick={handleSave}
                            className="rounded-lg bg-gray-900 px-3 py-1.5 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Save override
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AvailabilityEditor({
    onCreated,
    existingSchedule,
}: {
    onCreated: () => Promise<void> | void;
    existingSchedule: BackendSchedule | null;
}) {
    const [name, setName] = useState("Working hours");
    const [timezone, setTimezone] = useState("Asia/Kolkata");
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const [schedule, setSchedule] = useState<Record<DayKey, DaySchedule>>({
        sunday: { enabled: false, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        monday: { enabled: true, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        tuesday: { enabled: true, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        wednesday: { enabled: true, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        thursday: { enabled: true, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        friday: { enabled: true, ranges: [{ start: "9:00am", end: "5:00pm" }] },
        saturday: { enabled: false, ranges: [{ start: "9:00am", end: "5:00pm" }] },
    });
    const [overrides, setOverrides] = useState<DateOverride[]>([]);
    const [showOverrideModal, setShowOverrideModal] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (!existingSchedule) return;

        setName(existingSchedule.name);
        setTimezone(existingSchedule.timezone);

        const mappedOverrides: DateOverride[] = (existingSchedule.overrides ?? []).map(
            (o) => ({
                id: o.id,
                date: o.date.split("T")[0],
                unavailable: o.isBlocked,
                ranges:
                    o.isBlocked || o.startTimeMinutes == null || o.endTimeMinutes == null
                        ? [{ start: "9:00am", end: "5:00pm" }]
                        : [
                            {
                                start: minutesToLabel(o.startTimeMinutes),
                                end: minutesToLabel(o.endTimeMinutes),
                            },
                        ],
            }),
        );

        setOverrides(mappedOverrides);
    }, [existingSchedule]);

    const toggleDay = (day: DayKey) =>
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled },
        }));

    const updateRange = (
        day: DayKey,
        idx: number,
        field: "start" | "end",
        val: string,
    ) => {
        setSchedule((prev) => {
            const ranges = [...prev[day].ranges];
            ranges[idx] = { ...ranges[idx], [field]: val };
            return { ...prev, [day]: { ...prev[day], ranges } };
        });
    };

    const addRange = (day: DayKey) =>
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                ranges: [...prev[day].ranges, { start: "9:00am", end: "5:00pm" }],
            },
        }));

    const removeRange = (day: DayKey, idx: number) =>
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                ranges: prev[day].ranges.filter((_, i) => i !== idx),
            },
        }));

    const handleAddOverride = (data: Omit<DateOverride, "id">) => {
        setOverrides((prev) => {
            const filtered = prev.filter((o) => o.date !== data.date);
            return [
                ...filtered,
                { ...data, id: Math.random().toString(36).slice(2) },
            ].sort((a, b) => a.date.localeCompare(b.date));
        });
    };

    const removeOverride = (id: string) =>
        setOverrides((prev) => prev.filter((o) => o.id !== id));

    async function handleSave() {
        setLocalError(null);
        if (!name.trim()) {
            setLocalError("Please enter a schedule name.");
            return;
        }

        const rules = DAY_KEYS.flatMap((day, dayIndex) => {
            const conf = schedule[day];
            if (!conf.enabled) return [];
            return conf.ranges.map((r) => ({
                dayOfWeek: dayIndex, // Sunday = 0 ... Saturday = 6
                startTimeMinutes: parseTimeToMinutes(r.start),
                endTimeMinutes: parseTimeToMinutes(r.end),
            }));
        }).filter((r) => r.endTimeMinutes > r.startTimeMinutes);

        if (rules.length === 0) {
            setLocalError("Enable at least one day with a valid time range.");
            return;
        }

        const overridesPayload = overrides.map((o) => {
            if (o.unavailable) {
                return {
                    date: o.date,
                    isBlocked: true,
                };
            }
            return {
                date: o.date,
                isBlocked: false,
                startTimeMinutes: parseTimeToMinutes(o.ranges[0].start),
                endTimeMinutes: parseTimeToMinutes(
                    o.ranges[o.ranges.length - 1].end,
                ),
            };
        });

        const payload = {
            name,
            timezone,
            rules,
            overrides: overridesPayload,
        };

        setSaving(true);
        try {
            if (existingSchedule) {
                await apiPut(`/api/availability/schedules/${existingSchedule.id}`, payload);
            } else {
                await apiPost("/api/availability/schedules", payload);
            }
            await onCreated();
            showToast("Availability schedule saved", "success");
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Failed to save availability schedule";
            setLocalError(msg);
            showToast(msg, "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            {showOverrideModal && (
                <OverrideModal
                    onClose={() => setShowOverrideModal(false)}
                    onSave={handleAddOverride}
                />
            )}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-base font-semibold text-gray-900">
                            Working hours
                        </h2>
                        <p className="max-w-md text-xs text-gray-500">
                            Choose which days you&apos;re available and the time ranges for
                            each day. We&apos;ll use this schedule when generating booking
                            slots.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Schedule name
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Timezone
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">
                    {DAY_KEYS.map((day) => {
                        const conf = schedule[day];
                        return (
                            <div
                                key={day}
                                className={`flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-4 ${conf.enabled ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <div className="flex w-32 items-center gap-2 text-xs font-medium text-gray-800">
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`h-5 w-9 rounded-full border transition-colors ${conf.enabled
                                                ? "border-gray-900 bg-gray-900"
                                                : "border-gray-300 bg-gray-200"
                                            }`}
                                    >
                                        <span
                                            className={`block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${conf.enabled ? "translate-x-4" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                    <span
                                        className={
                                            conf.enabled
                                                ? "text-gray-900"
                                                : "text-gray-400 line-through"
                                        }
                                    >
                                        {DAY_LABELS[day]}
                                    </span>
                                </div>

                                {!conf.enabled ? (
                                    <span className="text-xs text-gray-400">Unavailable</span>
                                ) : (
                                    <div className="flex flex-1 flex-col gap-2">
                                        {conf.ranges.map((range, idx) => (
                                            <div
                                                key={`${day}-${idx}`}
                                                className="flex flex-wrap items-center gap-2"
                                            >
                                                <TimeSelect
                                                    value={range.start}
                                                    onChange={(v) => updateRange(day, idx, "start", v)}
                                                />
                                                <span className="text-xs text-gray-400">–</span>
                                                <TimeSelect
                                                    value={range.end}
                                                    onChange={(v) => updateRange(day, idx, "end", v)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        idx === conf.ranges.length - 1
                                                            ? addRange(day)
                                                            : removeRange(day, idx)
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                                >
                                                    {idx === conf.ranges.length - 1 ? "+" : "–"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Date overrides */}
                <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Date overrides
                                </h3>
                                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[9px] font-semibold text-gray-400">
                                    i
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Add specific dates where your availability is different from
                                your weekly hours.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowOverrideModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-900 text-[9px] text-white">
                                +
                            </span>
                            Add override
                        </button>
                    </div>

                    {overrides.length > 0 && (
                        <div className="space-y-2">
                            {overrides.map((ov) => (
                                <div
                                    key={ov.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs"
                                >
                                    <div>
                                        <div className="text-[13px] font-semibold text-gray-900">
                                            {fmtDate(ov.date)}
                                        </div>
                                        <div className="text-[11px] text-gray-600">
                                            {ov.unavailable
                                                ? "Unavailable all day"
                                                : `${ov.ranges[0].start} – ${ov.ranges[ov.ranges.length - 1].end
                                                }`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ov.unavailable
                                                    ? "border border-red-200 bg-red-50 text-red-600"
                                                    : "border border-emerald-200 bg-emerald-50 text-emerald-600"
                                                }`}
                                        >
                                            {ov.unavailable ? "Unavailable" : "Custom hours"}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeOverride(ov.id)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {localError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {localError}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {saving ? "Saving…" : "Save schedule"}
                    </button>
                </div>
            </div>
        </div>
    );
}