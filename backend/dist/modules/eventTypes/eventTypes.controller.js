"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEventTypesHandler = listEventTypesHandler;
exports.listPersonEventTypesHandler = listPersonEventTypesHandler;
exports.listNonPersonEventTypesHandler = listNonPersonEventTypesHandler;
exports.getEventTypeHandler = getEventTypeHandler;
exports.createEventTypeHandler = createEventTypeHandler;
exports.updateEventTypeHandler = updateEventTypeHandler;
exports.deleteEventTypeHandler = deleteEventTypeHandler;
const eventTypes_validation_1 = require("./eventTypes.validation");
const eventTypes_service_1 = require("./eventTypes.service");
async function listEventTypesHandler(_req, res) {
    const eventTypes = await (0, eventTypes_service_1.listEventTypes)();
    res.json(eventTypes);
}
async function listPersonEventTypesHandler(_req, res) {
    const eventTypes = await (0, eventTypes_service_1.listPersonEventTypes)();
    res.json(eventTypes);
}
async function listNonPersonEventTypesHandler(_req, res) {
    const eventTypes = await (0, eventTypes_service_1.listNonPersonEventTypes)();
    res.json(eventTypes);
}
async function getEventTypeHandler(req, res) {
    const { id } = req.params;
    const eventType = await (0, eventTypes_service_1.getEventTypeById)(id);
    if (!eventType) {
        return res.status(404).json({ message: "Event type not found" });
    }
    return res.json(eventType);
}
async function createEventTypeHandler(req, res) {
    const parseResult = eventTypes_validation_1.createEventTypeSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.flatten() });
    }
    try {
        const created = await (0, eventTypes_service_1.createEventType)(parseResult.data);
        return res.status(201).json(created);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to create event type",
        });
    }
}
async function updateEventTypeHandler(req, res) {
    const { id } = req.params;
    const parseResult = eventTypes_validation_1.updateEventTypeSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.flatten() });
    }
    try {
        const updated = await (0, eventTypes_service_1.updateEventType)(id, parseResult.data);
        if (!updated) {
            return res.status(404).json({ message: "Event type not found" });
        }
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to update event type",
        });
    }
}
async function deleteEventTypeHandler(req, res) {
    const { id } = req.params;
    try {
        await (0, eventTypes_service_1.deleteEventType)(id);
        return res.status(204).send();
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to delete event type",
        });
    }
}
