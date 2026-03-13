"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("./bookings.controller");
const router = (0, express_1.Router)();
router.get("/", bookings_controller_1.listBookingsHandler);
router.post("/:id/cancel", bookings_controller_1.cancelBookingHandler);
exports.default = router;
