import { Router } from "express";
import {
  createEventTypeHandler,
  deleteEventTypeHandler,
  getEventTypeHandler,
  listEventTypesHandler,
  listNonPersonEventTypesHandler,
  listPersonEventTypesHandler,
  updateEventTypeHandler,
} from "./eventTypes.controller";

const router = Router();

router.get("/", listEventTypesHandler);
router.get("/people", listPersonEventTypesHandler);
router.get("/events", listNonPersonEventTypesHandler);
router.get("/:id", getEventTypeHandler);
router.post("/", createEventTypeHandler);
router.put("/:id", updateEventTypeHandler);
router.delete("/:id", deleteEventTypeHandler);

export default router;

