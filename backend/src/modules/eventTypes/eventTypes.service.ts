import { prisma } from "../../prisma/client";
import { CreateEventTypeInput, UpdateEventTypeInput } from "./eventTypes.validation";

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

export async function listEventTypes() {
  const ownerId = await getDefaultOwnerId();
  return prisma.eventType.findMany({
    where: { ownerId },
    include: {
      schedules: {
        include: {
          schedule: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPersonEventTypes() {
  const ownerId = await getDefaultOwnerId();
  return prisma.eventType.findMany({
    where: { ownerId, isPerson: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listNonPersonEventTypes() {
  const ownerId = await getDefaultOwnerId();
  return prisma.eventType.findMany({
    where: { ownerId, isPerson: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventTypeById(id: string) {
  const ownerId = await getDefaultOwnerId();
  return prisma.eventType.findFirst({
    where: { id, ownerId },
    include: {
      schedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
}

export async function createEventType(data: CreateEventTypeInput) {
  const ownerId = await getDefaultOwnerId();

  const schedule = await prisma.availabilitySchedule.findFirst({
    where: {
      id: data.scheduleId,
      ownerId,
    },
  });

  if (!schedule) {
    throw new Error("Schedule not found for default owner");
  }

  return prisma.$transaction(async (tx) => {
    const eventType = await tx.eventType.create({
      data: {
        ownerId,
        title: data.title,
        description: data.description,
        durationMinutes: data.durationMinutes,
        bufferBeforeMinutes: data.bufferBeforeMinutes ?? 0,
        bufferAfterMinutes: data.bufferAfterMinutes ?? 0,
        slug: data.slug,
        isPerson: data.isPerson ?? false,
      },
    });

    await tx.eventTypeSchedule.create({
      data: {
        eventTypeId: eventType.id,
        scheduleId: schedule.id,
      },
    });

    return eventType;
  });
}

export async function updateEventType(id: string, data: UpdateEventTypeInput) {
  const ownerId = await getDefaultOwnerId();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.eventType.findFirst({
      where: { id, ownerId },
    });

    if (!existing) {
      return null;
    }

    const updated = await tx.eventType.update({
      where: { id: existing.id },
      data: {
        title: data.title ?? existing.title,
        description: data.description ?? existing.description,
        durationMinutes: data.durationMinutes ?? existing.durationMinutes,
        bufferBeforeMinutes:
          typeof data.bufferBeforeMinutes === "number"
            ? data.bufferBeforeMinutes
            : existing.bufferBeforeMinutes,
        bufferAfterMinutes:
          typeof data.bufferAfterMinutes === "number"
            ? data.bufferAfterMinutes
            : existing.bufferAfterMinutes,
        slug: data.slug ?? existing.slug,
        isPerson:
          typeof data.isPerson === "boolean" ? data.isPerson : existing.isPerson,
      },
    });

    if (data.scheduleId) {
      const schedule = await tx.availabilitySchedule.findFirst({
        where: { id: data.scheduleId, ownerId },
      });

      if (!schedule) {
        throw new Error("Schedule not found for default owner");
      }

      await tx.eventTypeSchedule.deleteMany({
        where: { eventTypeId: existing.id },
      });

      await tx.eventTypeSchedule.create({
        data: {
          eventTypeId: existing.id,
          scheduleId: schedule.id,
        },
      });
    }

    return updated;
  });
}

export async function deleteEventType(id: string) {
  const ownerId = await getDefaultOwnerId();

  const now = new Date();

  const futureBookings = await prisma.booking.count({
    where: {
      eventTypeId: id,
      schedule: {
        ownerId,
      },
      startTime: {
        gte: now,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  });

  if (futureBookings > 0) {
    throw new Error("Cannot delete event type with future bookings");
  }

  await prisma.eventType.deleteMany({
    where: {
      id,
      ownerId,
    },
  });
}