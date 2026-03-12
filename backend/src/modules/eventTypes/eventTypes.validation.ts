import { z } from "zod";

export const createEventTypeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  slug: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/, {
    message: "Slug can contain letters, numbers and dashes only",
  }),
  scheduleId: z.string().min(1),
  isPerson: z.boolean().optional(),
});

export const updateEventTypeSchema = createEventTypeSchema.partial();

export type CreateEventTypeInput = z.infer<typeof createEventTypeSchema>;
export type UpdateEventTypeInput = z.infer<typeof updateEventTypeSchema>;

