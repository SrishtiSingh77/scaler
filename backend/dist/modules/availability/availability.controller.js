"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchedulesHandler = listSchedulesHandler;
exports.getScheduleHandler = getScheduleHandler;
exports.createScheduleHandler = createScheduleHandler;
exports.updateScheduleHandler = updateScheduleHandler;
exports.deleteScheduleHandler = deleteScheduleHandler;
const availability_validation_1 = require("./availability.validation");
const availability_service_1 = require("./availability.service");
async function listSchedulesHandler(_req, res) {
    const schedules = await (0, availability_service_1.listSchedules)();
    res.json(schedules);
}
async function getScheduleHandler(req, res) {
    const { id } = req.params;
    const schedule = await (0, availability_service_1.getScheduleById)(id);
    if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
    }
    return res.json(schedule);
}
async function createScheduleHandler(req, res) {
    const parsed = availability_validation_1.createScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
    }
    try {
        const created = await (0, availability_service_1.createSchedule)(parsed.data);
        return res.status(201).json(created);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to create schedule",
        });
    }
}
async function updateScheduleHandler(req, res) {
    const { id } = req.params;
    const parsed = availability_validation_1.updateScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
    }
    try {
        const updated = await (0, availability_service_1.updateSchedule)(id, parsed.data);
        if (!updated) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to update schedule",
        });
    }
}
async function deleteScheduleHandler(req, res) {
    const { id } = req.params;
    try {
        await (0, availability_service_1.deleteSchedule)(id);
        return res.status(204).send();
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to delete schedule",
        });
    }
}
