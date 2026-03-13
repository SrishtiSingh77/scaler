"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchedules = listSchedules;
exports.getScheduleById = getScheduleById;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
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
async function listSchedules() {
    const ownerId = await getDefaultOwnerId();
    return client_1.prisma.availabilitySchedule.findMany({
        where: { ownerId },
        include: { rules: true },
        orderBy: { createdAt: "asc" },
    });
}
async function getScheduleById(id) {
    const ownerId = await getDefaultOwnerId();
    return client_1.prisma.availabilitySchedule.findFirst({
        where: { id, ownerId },
        include: { rules: true },
    });
}
async function createSchedule(data) {
    const ownerId = await getDefaultOwnerId();
    return client_1.prisma.$transaction(async (tx) => {
        const schedule = await tx.availabilitySchedule.create({
            data: {
                ownerId,
                name: data.name,
                timezone: data.timezone,
            },
        });
        await tx.availabilityRule.createMany({
            data: data.rules.map((rule) => ({
                scheduleId: schedule.id,
                dayOfWeek: rule.dayOfWeek,
                startTimeMinutes: rule.startTimeMinutes,
                endTimeMinutes: rule.endTimeMinutes,
            })),
        });
        return schedule;
    });
}
async function updateSchedule(id, data) {
    const ownerId = await getDefaultOwnerId();
    return client_1.prisma.$transaction(async (tx) => {
        const existing = await tx.availabilitySchedule.findFirst({
            where: { id, ownerId },
        });
        if (!existing) {
            return null;
        }
        const updated = await tx.availabilitySchedule.update({
            where: { id: existing.id },
            data: {
                name: data.name ?? existing.name,
                timezone: data.timezone ?? existing.timezone,
            },
        });
        if (data.rules && data.rules.length > 0) {
            await tx.availabilityRule.deleteMany({
                where: { scheduleId: existing.id },
            });
            await tx.availabilityRule.createMany({
                data: data.rules.map((rule) => ({
                    scheduleId: existing.id,
                    dayOfWeek: rule.dayOfWeek,
                    startTimeMinutes: rule.startTimeMinutes,
                    endTimeMinutes: rule.endTimeMinutes,
                })),
            });
        }
        return updated;
    });
}
async function deleteSchedule(id) {
    const ownerId = await getDefaultOwnerId();
    const linkedEventTypes = await client_1.prisma.eventTypeSchedule.count({
        where: { scheduleId: id, eventType: { ownerId } },
    });
    if (linkedEventTypes > 0) {
        throw new Error("Cannot delete schedule that is linked to event types");
    }
    await client_1.prisma.availabilitySchedule.deleteMany({
        where: { id, ownerId },
    });
}
