"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicEventHandler = getPublicEventHandler;
exports.getSlotsHandler = getSlotsHandler;
exports.createBookingHandler = createBookingHandler;
const public_service_1 = require("./public.service");
const public_validation_1 = require("./public.validation");
async function getPublicEventHandler(req, res) {
    const { slug } = req.params;
    const event = await (0, public_service_1.getPublicEventBySlug)(slug);
    if (!event) {
        return res.status(404).json({ message: "Event type not found" });
    }
    return res.json(event);
}
async function getSlotsHandler(req, res) {
    const { slug } = req.params;
    const parsed = public_validation_1.getSlotsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
    }
    try {
        const result = await (0, public_service_1.getAvailableSlotsForDate)(slug, parsed.data);
        if (result === null) {
            return res.status(404).json({ message: "Event type not found" });
        }
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to compute available slots",
        });
    }
}
async function createBookingHandler(req, res) {
    const { slug } = req.params;
    const parsed = public_validation_1.createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
    }
    try {
        const booking = await (0, public_service_1.createPublicBooking)(slug, parsed.data);
        return res.status(201).json(booking);
    }
    catch (err) {
        return res.status(400).json({
            message: err instanceof Error ? err.message : "Failed to create booking",
        });
    }
}
