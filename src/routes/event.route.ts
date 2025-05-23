import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller";

export default (router: Router) => {
  router.get("/", getAllEvents);
  //   router.get("/:id", getEventById);
  //   router.post("/", authenticate, createEvent);
  //   router.put("/:id", authenticate, updateEvent);
  //   router.delete("/:id", authenticate, deleteEvent);
};
