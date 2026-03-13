"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduleSchema = exports.createScheduleSchema = exports.availabilityRuleSchema = void 0;
const zod_1 = require("zod");
exports.availabilityRuleSchema = zod_1.z.object({
    dayOfWeek: zod_1.z.number().int().min(0).max(6),
    startTimeMinutes: zod_1.z.number().int().min(0).max(24 * 60),
    endTimeMinutes: zod_1.z.number().int().min(0).max(24 * 60),
});
exports.createScheduleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    timezone: zod_1.z.string().min(1),
    rules: zod_1.z.array(exports.availabilityRuleSchema).nonempty(),
});
exports.updateScheduleSchema = exports.createScheduleSchema.partial();
