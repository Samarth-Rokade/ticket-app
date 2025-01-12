import { Router } from "express";
import { getEventById, deleteEvent, getAllEvents, createEvent, updateEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/organizerAuth.middleware.js";

const router = Router();

//Only verified organizers can access these routes
router.post("/create-event", verifyJWT, createEvent);
router.put("/update-event/:id", verifyJWT, updateEvent);
router.post("/delete-event/:id", verifyJWT, deleteEvent);

// Anyone can access these routes
router.get("/event/:id", getEventById);
router.get("/all-events", getAllEvents);

export default router