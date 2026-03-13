"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.cancelBooking = cancelBooking;
const luxon_1 = require("luxon");
const client_1 = require("../../prisma/client");
const DEFAULT_OWNER_EMAIL = "owner@example.com";
let defaultOwnerIdPromise = null;
async function getDefaultOwnerId() {
    if (!defaultOwnerIdPromise) {
        defaultOwnerIdPromise = (async () => {
            const user = await client_1.prisma.user.findUnique({
                where: { email: DEFAULT_OWNER_EMAIL },
            });
            if (!user) {
                throw new Error("Default owner user not found. Did you run the seed script?");
            }
            return user.id;
        })();
    }
    return defaultOwnerIdPromise;
}
async function listBookings(scope) {
    const ownerId = await getDefaultOwnerId();
    const now = luxon_1.DateTime.utc().toJSDate();
    const where = {
        schedule: {
            ownerId,
        },
    };
    if (scope === "upcoming") {
        where.startTime = { gte: now };
    }
    else if (scope === "past") {
        where.startTime = { lt: now };
    }
    return client_1.prisma.booking.findMany({
        where,
        include: {
            eventType: true,
            schedule: true,
        },
        orderBy: { startTime: "asc" },
    });
}
async function cancelBooking(id) {
    const ownerId = await getDefaultOwnerId();
    const booking = await client_1.prisma.booking.findFirst({
        where: {
            id,
            schedule: {
                ownerId,
            },
        },
    });
    if (!booking) {
        return null;
    }
    return client_1.prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
    });
}
