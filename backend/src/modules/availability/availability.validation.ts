import { z } from "zod";

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTimeMinutes: z.number().int().min(0).max(24 * 60),
  endTimeMinutes: z.number().int().min(0).max(24 * 60),
});

export const createScheduleSchema = z.object({
  name: z.string().min(1),
  timezone: z.string().min(1),
  rules: z.array(availabilityRuleSchema).nonempty(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;

