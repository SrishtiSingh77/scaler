import { z } from "zod";

export const getSlotsQuerySchema = z.object({
  date: z.string().min(1), // ISO date string (e.g. 2026-03-15)
});

export const createBookingSchema = z.object({
  bookerName: z.string().min(1),
  bookerEmail: z.string().email(),
  startTime: z.string().min(1), // ISO datetime string in event timezone or UTC
});

export type GetSlotsQuery = z.infer<typeof getSlotsQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

