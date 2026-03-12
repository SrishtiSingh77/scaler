import { PrismaClient, BookingStatus } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = "owner@example.com";

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      name: "Default Owner",
      email: ownerEmail,
    },
  });

  const timezone = "Asia/Kolkata";

  const schedule = await prisma.availabilitySchedule.upsert({
    where: {
      // composite unique not defined, so use id-based upsert pattern
      id: "default-schedule",
    },
    update: {},
    create: {
      id: "default-schedule",
      ownerId: owner.id,
      name: "Weekdays 9-5",
      timezone,
    },
  });

  // Clear and recreate rules for the default schedule
  await prisma.availabilityRule.deleteMany({
    where: { scheduleId: schedule.id },
  });

  const weekdayRules = [];
  for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek += 1) {
    weekdayRules.push({
      scheduleId: schedule.id,
      dayOfWeek,
      startTimeMinutes: 9 * 60,
      endTimeMinutes: 17 * 60,
    });
  }

  await prisma.availabilityRule.createMany({
    data: weekdayRules,
  });

  const eventType30 = await prisma.eventType.upsert({
    where: { slug: "intro-call-30" },
    update: {},
    create: {
      ownerId: owner.id,
      title: "Intro Call (30 min)",
      description: "A short introduction meeting.",
      durationMinutes: 30,
      slug: "intro-call-30",
    },
  });

  const eventType60 = await prisma.eventType.upsert({
    where: { slug: "deep-dive-60" },
    update: {},
    create: {
      ownerId: owner.id,
      title: "Deep Dive (60 min)",
      description: "A longer deep-dive session.",
      durationMinutes: 60,
      slug: "deep-dive-60",
    },
  });

  // Attach both event types to the default schedule
  await prisma.eventTypeSchedule.upsert({
    where: {
      eventTypeId_scheduleId: {
        eventTypeId: eventType30.id,
        scheduleId: schedule.id,
      },
    },
    update: {},
    create: {
      eventTypeId: eventType30.id,
      scheduleId: schedule.id,
    },
  });

  await prisma.eventTypeSchedule.upsert({
    where: {
      eventTypeId_scheduleId: {
        eventTypeId: eventType60.id,
        scheduleId: schedule.id,
      },
    },
    update: {},
    create: {
      eventTypeId: eventType60.id,
      scheduleId: schedule.id,
    },
  });

  // Create one past and one upcoming booking for the 30-min event
  const now = DateTime.utc();

  const pastStart = now.minus({ days: 2 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  const upcomingStart = now.plus({ days: 2 }).set({ hour: 10, minute: 0, second: 0, millisecond: 0 });

  await prisma.booking.createMany({
    data: [
      {
        eventTypeId: eventType30.id,
        scheduleId: schedule.id,
        bookerName: "Past Booker",
        bookerEmail: "past@example.com",
        startTime: pastStart.toJSDate(),
        endTime: pastStart.plus({ minutes: eventType30.durationMinutes }).toJSDate(),
        status: BookingStatus.CONFIRMED,
      },
      {
        eventTypeId: eventType30.id,
        scheduleId: schedule.id,
        bookerName: "Upcoming Booker",
        bookerEmail: "upcoming@example.com",
        startTime: upcomingStart.toJSDate(),
        endTime: upcomingStart.plus({ minutes: eventType30.durationMinutes }).toJSDate(),
        status: BookingStatus.CONFIRMED,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

