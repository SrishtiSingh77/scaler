import { DateTime } from "luxon";
import { prisma } from "../../prisma/client";
import { CreateBookingInput, GetSlotsQuery } from "./public.validation";

export async function getPublicEventBySlug(slug: string) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug },
    include: {
      schedules: {
        include: {
          schedule: {
            include: { rules: true, overrides: true },
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

export async function getAvailableSlotsForDate(
  slug: string,
  query: GetSlotsQuery,
) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug },
    include: {
      schedules: {
        include: {
          schedule: {
            include: { rules: true, overrides: true },
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
  const bufferBefore = eventType.bufferBeforeMinutes ?? 0;
  const bufferAfter = eventType.bufferAfterMinutes ?? 0;
  const date = DateTime.fromISO(query.date, { zone: timezone });
  if (!date.isValid) {
    throw new Error("Invalid date");
  }

  const startOfDay = date.startOf("day");
  const endOfDay = date.endOf("day");

  const dayOfWeek = startOfDay.weekday % 7; // luxon: 1 (Mon) - 7 (Sun), our schema: 0-6

  const rulesForDay = schedule.rules.filter(
    (rule) => rule.dayOfWeek === dayOfWeek,
  );
  if (rulesForDay.length === 0) {
    return { slots: [] };
  }

  // Date override: stored as UTC midnight date
  const overrideDate = startOfDay.toUTC().startOf("day").toJSDate();
  const override = schedule.overrides.find(
    (o) => o.date.getTime() === overrideDate.getTime(),
  );

  if (override?.isBlocked) {
    return { slots: [] };
  }

  const existingBookings = await prisma.booking.findMany({
    where: {
      scheduleId: schedule.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { gte: startOfDay.toJSDate(), lt: endOfDay.toJSDate() },
    },
    include: {
      eventType: true,
    },
  });

  const duration = eventType.durationMinutes;
  const slots: string[] = [];

  for (const rule of rulesForDay) {
    const windowStartMinutes = override?.startTimeMinutes ?? 0;
    const windowEndMinutes = override?.endTimeMinutes ?? 24 * 60;

    const effectiveStartMinutes = Math.max(
      rule.startTimeMinutes,
      windowStartMinutes,
    );
    const effectiveEndMinutes = Math.min(
      rule.endTimeMinutes,
      windowEndMinutes,
    );

    if (effectiveEndMinutes <= effectiveStartMinutes) {
      // Rule fully outside override window
      // eslint-disable-next-line no-continue
      continue;
    }

    const stepMinutes = duration + bufferBefore + bufferAfter;

    let slotStart = startOfDay.plus({ minutes: effectiveStartMinutes });
    const ruleEnd = startOfDay.plus({ minutes: effectiveEndMinutes });

    while (slotStart.plus({ minutes: duration }) <= ruleEnd) {
      const slotEnd = slotStart.plus({ minutes: duration });

      const hasOverlap = existingBookings.some((booking) => {
        const bookingStart = DateTime.fromJSDate(booking.startTime).setZone(
          timezone,
        );
        const bookingEnd = DateTime.fromJSDate(booking.endTime).setZone(
          timezone,
        );

        const bookingBufferBefore =
          booking.eventType.bufferBeforeMinutes ?? 0;
        const bookingBufferAfter =
          booking.eventType.bufferAfterMinutes ?? 0;

        const blockStart = bookingStart.minus({
          minutes: bookingBufferBefore,
        });
        const blockEnd = bookingEnd.plus({
          minutes: bookingBufferAfter,
        });

        const requestedBlockStart = slotStart.minus({
          minutes: bufferBefore,
        });
        const requestedBlockEnd = slotEnd.plus({
          minutes: bufferAfter,
        });

        return (
          requestedBlockStart < blockEnd && requestedBlockEnd > blockStart
        );
      });

      if (!hasOverlap) {
        slots.push(slotStart.toUTC().toISO());
      }

      // Move to the next potential slot respecting buffers
      slotStart = slotStart.plus({ minutes: stepMinutes });
    }
  }

  return { slots };
}

export async function createPublicBooking(
  slug: string,
  payload: CreateBookingInput,
) {
  const eventType = await prisma.eventType.findUnique({
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

  const startTime = DateTime.fromISO(payload.startTime, {
    zone: "utc",
  });
  if (!startTime.isValid) {
    throw new Error("Invalid startTime");
  }

  const endTime = startTime.plus({ minutes: eventType.durationMinutes });

  const bufferBefore = eventType.bufferBeforeMinutes ?? 0;
  const bufferAfter = eventType.bufferAfterMinutes ?? 0;

  const requestedBlockStart = startTime.minus({ minutes: bufferBefore });
  const requestedBlockEnd = endTime.plus({ minutes: bufferAfter });

  return prisma.$transaction(async (tx) => {
    const nearbyBookings = await tx.booking.findMany({
      where: {
        scheduleId: schedule.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { lt: requestedBlockEnd.toJSDate() },
        endTime: { gt: requestedBlockStart.toJSDate() },
      },
      include: {
        eventType: true,
      },
    });

    const hasOverlap = nearbyBookings.some((b) => {
      const bookingStart = DateTime.fromJSDate(b.startTime).setZone("utc");
      const bookingEnd = DateTime.fromJSDate(b.endTime).setZone("utc");
      const bookingBufferBefore = b.eventType.bufferBeforeMinutes ?? 0;
      const bookingBufferAfter = b.eventType.bufferAfterMinutes ?? 0;

      const blockStart = bookingStart.minus({
        minutes: bookingBufferBefore,
      });
      const blockEnd = bookingEnd.plus({
        minutes: bookingBufferAfter,
      });

      return requestedBlockStart < blockEnd && requestedBlockEnd > blockStart;
    });

    if (hasOverlap) {
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