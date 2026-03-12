import { Request, Response } from "express";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "./availability.validation";
import {
  createSchedule,
  deleteSchedule,
  getScheduleById,
  listSchedules,
  updateSchedule,
} from "./availability.service";

export async function listSchedulesHandler(_req: Request, res: Response) {
  const schedules = await listSchedules();
  res.json(schedules);
}

export async function getScheduleHandler(req: Request, res: Response) {
  const { id } = req.params;
  const schedule = await getScheduleById(id);
  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }
  return res.json(schedule);
}

export async function createScheduleHandler(req: Request, res: Response) {
  const parsed = createScheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const created = await createSchedule(parsed.data);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to create schedule",
    });
  }
}

export async function updateScheduleHandler(req: Request, res: Response) {
  const { id } = req.params;
  const parsed = updateScheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const updated = await updateSchedule(id, parsed.data);
    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to update schedule",
    });
  }
}

export async function deleteScheduleHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deleteSchedule(id);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to delete schedule",
    });
  }
}

