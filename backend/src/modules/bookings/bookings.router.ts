import { Router } from "express";
import {
  cancelBookingHandler,
  listBookingsHandler,
} from "./bookings.controller";

const router = Router();

router.get("/", listBookingsHandler);
router.post("/:id/cancel", cancelBookingHandler);

export default router;

