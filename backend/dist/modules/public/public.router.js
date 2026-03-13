"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_controller_1 = require("./public.controller");
const router = (0, express_1.Router)();
router.get("/event-types/:slug", public_controller_1.getPublicEventHandler);
router.get("/event-types/:slug/slots", public_controller_1.getSlotsHandler);
router.post("/event-types/:slug/book", public_controller_1.createBookingHandler);
exports.default = router;
