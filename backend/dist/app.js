"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const eventTypes_router_1 = __importDefault(require("./modules/eventTypes/eventTypes.router"));
const availability_router_1 = __importDefault(require("./modules/availability/availability.router"));
const public_router_1 = __importDefault(require("./modules/public/public.router"));
const bookings_router_1 = __importDefault(require("./modules/bookings/bookings.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/event-types", eventTypes_router_1.default);
app.use("/api/availability", availability_router_1.default);
app.use("/api/public", public_router_1.default);
app.use("/api/bookings", bookings_router_1.default);
exports.default = app;
