import { Router } from "express";
import {
  createBookingHandler,
  getPublicEventHandler,
  getSlotsHandler,
} from "./public.controller";

const router = Router();

router.get("/event-types/:slug", getPublicEventHandler);
router.get("/event-types/:slug/slots", getSlotsHandler);
router.post("/event-types/:slug/book", createBookingHandler);

export default router;

