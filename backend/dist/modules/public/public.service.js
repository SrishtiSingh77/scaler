"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicEventBySlug = getPublicEventBySlug;
exports.getAvailableSlotsForDate = getAvailableSlotsForDate;
exports.createPublicBooking = createPublicBooking;
const luxon_1 = require("luxon");
const client_1 = require("../../prisma/client");
async function getPublicEventBySlug(slug) {
    const eventType = await client_1.prisma.eventType.findUnique({
        where: { slug },
        include: {
            schedules: {
                include: {
                    schedule: {
                        include: { rules: true },
                    },
                },
            },
        },
    });
    if (!eventType) {
        return null;
    }
    const primarySchedule = eventType.schedules[0]?.schedule ?? null;
    return {
        id: eventType.id,
        title: eventType.title,
        description: eventType.description,
        durationMinutes: eventType.durationMinutes,
        slug: eventType.slug,
        schedule: primarySchedule
            ? {
                id: primarySchedule.id,
                name: primarySchedule.name,
                timezone: primarySchedule.timezone,
            }
            : null,
    };
}
async function getAvailableSlotsForDate(slug, query) {
    const eventType = await client_1.prisma.eventType.findUnique({
        where: { slug },
        include: {
            schedules: {
                include: {
                    schedule: {
                        include: { rules: true },
                    },
                },
            },
        },
    });
    if (!eventType) {
        return null;
    }
    const schedule = eventType.schedules[0]?.schedule;
    if (!schedule) {
        return { slots: [] };
    }
    const { timezone } = schedule;
    const date = luxon_1.DateTime.fromISO(query.date, { zone: timezone });
    if (!date.isValid) {
        throw new Error("Invalid date");
    }
    const startOfDay = date.startOf("day");
    const endOfDay = date.endOf("day");
    const dayOfWeek = startOfDay.weekday % 7; // luxon: 1 (Mon) - 7 (Sun), our schema: 0-6
    const rulesForDay = schedule.rules.filter((rule) => rule.dayOfWeek === dayOfWeek);
    if (rulesForDay.length === 0) {
        return { slots: [] };
    }
    const existingBookings = await client_1.prisma.booking.findMany({
        where: {
            eventTypeId: eventType.id,
            scheduleId: schedule.id,
            status: { in: ["PENDING", "CONFIRMED"] },
            startTime: { gte: startOfDay.toJSDate(), lt: endOfDay.toJSDate() },
        },
    });
    const duration = eventType.durationMinutes;
    const slots = [];
    for (const rule of rulesForDay) {
        let slotStart = startOfDay.plus({ minutes: rule.startTimeMinutes });
        const ruleEnd = startOfDay.plus({ minutes: rule.endTimeMinutes });
        while (slotStart.plus({ minutes: duration }) <= ruleEnd) {
            const slotEnd = slotStart.plus({ minutes: duration });
            const hasOverlap = existingBookings.some((booking) => {
                const bookingStart = luxon_1.DateTime.fromJSDate(booking.startTime);
                const bookingEnd = luxon_1.DateTime.fromJSDate(booking.endTime);
                return bookingStart < slotEnd && bookingEnd > slotStart;
            });
            if (!hasOverlap) {
                slots.push(slotStart.toUTC().toISO());
            }
            slotStart = slotStart.plus({ minutes: duration });
        }
    }
    return { slots };
}
async function createPublicBooking(slug, payload) {
    const eventType = await client_1.prisma.eventType.findUnique({
        where: { slug },
        include: {
            schedules: {
                include: {
                    schedule: true,
                },
            },
        },
    });
    if (!eventType) {
        throw new Error("Event type not found");
    }
    const schedule = eventType.schedules[0]?.schedule;
    if (!schedule) {
        throw new Error("No schedule configured for event type");
    }
    const startTime = luxon_1.DateTime.fromISO(payload.startTime, {
        zone: "utc",
    });
    if (!startTime.isValid) {
        throw new Error("Invalid startTime");
    }
    const endTime = startTime.plus({ minutes: eventType.durationMinutes });
    return client_1.prisma.$transaction(async (tx) => {
        const overlapping = await tx.booking.count({
            where: {
                eventTypeId: eventType.id,
                scheduleId: schedule.id,
                status: { in: ["PENDING", "CONFIRMED"] },
                startTime: { lt: endTime.toJSDate() },
                endTime: { gt: startTime.toJSDate() },
            },
        });
        if (overlapping > 0) {
            throw new Error("Time slot is no longer available");
        }
        const booking = await tx.booking.create({
            data: {
                eventTypeId: eventType.id,
                scheduleId: schedule.id,
                bookerName: payload.bookerName,
                bookerEmail: payload.bookerEmail,
                startTime: startTime.toJSDate(),
                endTime: endTime.toJSDate(),
            },
        });
        return booking;
    });
}
