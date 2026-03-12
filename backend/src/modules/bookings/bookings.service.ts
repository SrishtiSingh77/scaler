import { DateTime } from "luxon";
import { prisma } from "../../prisma/client";

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

export async function listBookings(scope: "upcoming" | "past" | "all") {
  const ownerId = await getDefaultOwnerId();
  const now = DateTime.utc().toJSDate();

  const where: any = {
    schedule: {
      ownerId,
    },
  };

  if (scope === "upcoming") {
    where.startTime = { gte: now };
  } else if (scope === "past") {
    where.startTime = { lt: now };
  }

  return prisma.booking.findMany({
    where,
    include: {
      eventType: true,
      schedule: true,
    },
    orderBy: { startTime: "asc" },
  });
}

export async function cancelBooking(id: string) {
  const ownerId = await getDefaultOwnerId();

  const booking = await prisma.booking.findFirst({
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

  return prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });
}

