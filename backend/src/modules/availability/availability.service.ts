import { prisma } from "../../prisma/client";
import {
  CreateScheduleInput,
  UpdateScheduleInput,
} from "./availability.validation";

const DEFAULT_OWNER_EMAIL = "owner@example.com";
let defaultOwnerIdPromise: Promise<string> | null = null;

async function getDefaultOwnerId() {
  if (!defaultOwnerIdPromise) {
    defaultOwnerIdPromise = (async () => {
      const user = await prisma.user.findUnique({
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

export async function listSchedules() {
  const ownerId = await getDefaultOwnerId();
  return prisma.availabilitySchedule.findMany({
    where: { ownerId },
    include: { rules: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getScheduleById(id: string) {
  const ownerId = await getDefaultOwnerId();
  return prisma.availabilitySchedule.findFirst({
    where: { id, ownerId },
    include: { rules: true },
  });
}

export async function createSchedule(data: CreateScheduleInput) {
  const ownerId = await getDefaultOwnerId();

  return prisma.$transaction(async (tx) => {
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

export async function updateSchedule(id: string, data: UpdateScheduleInput) {
  const ownerId = await getDefaultOwnerId();

  return prisma.$transaction(async (tx) => {
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

export async function deleteSchedule(id: string) {
  const ownerId = await getDefaultOwnerId();

  const linkedEventTypes = await prisma.eventTypeSchedule.count({
    where: { scheduleId: id, eventType: { ownerId } },
  });

  if (linkedEventTypes > 0) {
    throw new Error("Cannot delete schedule that is linked to event types");
  }

  await prisma.availabilitySchedule.deleteMany({
    where: { id, ownerId },
  });
}

