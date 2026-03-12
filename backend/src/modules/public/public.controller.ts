import { Request, Response } from "express";
import {
  createPublicBooking,
  getAvailableSlotsForDate,
  getPublicEventBySlug,
} from "./public.service";
import {
  createBookingSchema,
  getSlotsQuerySchema,
} from "./public.validation";

export async function getPublicEventHandler(req: Request, res: Response) {
  const { slug } = req.params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    return res.status(404).json({ message: "Event type not found" });
  }
  return res.json(event);
}

export async function getSlotsHandler(req: Request, res: Response) {
  const { slug } = req.params;
  const parsed = getSlotsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const result = await getAvailableSlotsForDate(slug, parsed.data);
    if (result === null) {
      return res.status(404).json({ message: "Event type not found" });
    }
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to compute available slots",
    });
  }
}

export async function createBookingHandler(req: Request, res: Response) {
  const { slug } = req.params;
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const booking = await createPublicBooking(slug, parsed.data);
    return res.status(201).json(booking);
  } catch (err) {
    return res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to create booking",
    });
  }
}

