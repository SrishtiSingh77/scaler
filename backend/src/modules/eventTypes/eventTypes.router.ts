import { Router } from "express";
import {
  createEventTypeHandler,
  deleteEventTypeHandler,
  getEventTypeHandler,
  listEventTypesHandler,
  updateEventTypeHandler,
} from "./eventTypes.controller";

const router = Router();

router.get("/", listEventTypesHandler);
router.get("/:id", getEventTypeHandler);
router.post("/", createEventTypeHandler);
router.put("/:id", updateEventTypeHandler);
router.delete("/:id", deleteEventTypeHandler);

export default router;

