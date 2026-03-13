"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventTypeSchema = exports.createEventTypeSchema = void 0;
const zod_1 = require("zod");
exports.createEventTypeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    durationMinutes: zod_1.z.number().int().positive(),
    bufferBeforeMinutes: zod_1.z.number().int().min(0).default(0),
    bufferAfterMinutes: zod_1.z.number().int().min(0).default(0),
    slug: zod_1.z.string().min(1).regex(/^[a-zA-Z0-9-]+$/, {
        message: "Slug can contain letters, numbers and dashes only",
    }),
    scheduleId: zod_1.z.string().min(1),
    isPerson: zod_1.z.boolean().optional(),
});
exports.updateEventTypeSchema = exports.createEventTypeSchema.partial();
