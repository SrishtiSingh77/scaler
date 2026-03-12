import { Router } from "express";
import {
  createScheduleHandler,
  deleteScheduleHandler,
  getScheduleHandler,
  listSchedulesHandler,
  updateScheduleHandler,
} from "./availability.controller";

const router = Router();

router.get("/schedules", listSchedulesHandler);
router.get("/schedules/:id", getScheduleHandler);
router.post("/schedules", createScheduleHandler);
router.put("/schedules/:id", updateScheduleHandler);
router.delete("/schedules/:id", deleteScheduleHandler);

export default router;

