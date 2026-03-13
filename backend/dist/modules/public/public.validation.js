"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = exports.getSlotsQuerySchema = void 0;
const zod_1 = require("zod");
exports.getSlotsQuerySchema = zod_1.z.object({
    date: zod_1.z.string().min(1), // ISO date string (e.g. 2026-03-15)
});
exports.createBookingSchema = zod_1.z.object({
    bookerName: zod_1.z.string().min(1),
    bookerEmail: zod_1.z.string().email(),
    startTime: zod_1.z.string().min(1), // ISO datetime string in event timezone or UTC
});
