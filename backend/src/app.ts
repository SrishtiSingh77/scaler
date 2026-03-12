import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventTypesRouter from "./modules/eventTypes/eventTypes.router";
import availabilityRouter from "./modules/availability/availability.router";
import publicRouter from "./modules/public/public.router";
import bookingsRouter from "./modules/bookings/bookings.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/event-types", eventTypesRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/public", publicRouter);
app.use("/api/bookings", bookingsRouter);

export default app;

