import { Request, Response } from "express";
import { cancelBooking, listBookings } from "./bookings.service";

export async function listBookingsHandler(req: Request, res: Response) {
  const scopeParam = (req.query.scope as string) || "upcoming";
  const scope =
    scopeParam === "past" || scopeParam === "all" ? scopeParam : "upcoming";

  const bookings = await listBookings(scope);
  res.json(bookings);
}

export async function cancelBookingHandler(req: Request, res: Response) {
  const { id } = req.params;
  const booking = await cancelBooking(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.json(booking);
}

