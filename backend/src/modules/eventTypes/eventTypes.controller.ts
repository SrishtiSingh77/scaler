import { Request, Response } from "express";
import {
  createEventTypeSchema,
  updateEventTypeSchema,
} from "./eventTypes.validation";
import {
  createEventType,
  deleteEventType,
  getEventTypeById,
  listEventTypes,
  listNonPersonEventTypes,
  listPersonEventTypes,
  updateEventType,
} from "./eventTypes.service";

export async function listEventTypesHandler(_req: Request, res: Response) {
  const eventTypes = await listEventTypes();
  res.json(eventTypes);
}

export async function listPersonEventTypesHandler(_req: Request, res: Response) {
  const eventTypes = await listPersonEventTypes();
  res.json(eventTypes);
}

export async function listNonPersonEventTypesHandler(
  _req: Request,
  res: Response,
) {
  const eventTypes = await listNonPersonEventTypes();
  res.json(eventTypes);
}

export async function getEventTypeHandler(req: Request, res: Response) {
  const { id } = req.params;
  const eventType = await getEventTypeById(id);
  if (!eventType) {
    return res.status(404).json({ message: "Event type not found" });
  }
  return res.json(eventType);
}

export async function createEventTypeHandler(req: Request, res: Response) {
  const parseResult = createEventTypeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  try {
    const created = await createEventType(parseResult.data);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to create event type",
    });
  }
}

export async function updateEventTypeHandler(req: Request, res: Response) {
  const { id } = req.params;

  const parseResult = updateEventTypeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  try {
    const updated = await updateEventType(id, parseResult.data);
    if (!updated) {
      return res.status(404).json({ message: "Event type not found" });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to update event type",
    });
  }
}

export async function deleteEventTypeHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deleteEventType(id);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to delete event type",
    });
  }
}

