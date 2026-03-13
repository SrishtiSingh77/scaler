"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookingsHandler = listBookingsHandler;
exports.cancelBookingHandler = cancelBookingHandler;
const bookings_service_1 = require("./bookings.service");
async function listBookingsHandler(req, res) {
    const scopeParam = req.query.scope || "upcoming";
    const scope = scopeParam === "past" || scopeParam === "all" ? scopeParam : "upcoming";
    const bookings = await (0, bookings_service_1.listBookings)(scope);
    res.json(bookings);
}
async function cancelBookingHandler(req, res) {
    const { id } = req.params;
    const booking = await (0, bookings_service_1.cancelBooking)(id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.json(booking);
}
