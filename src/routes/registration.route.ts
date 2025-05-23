import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { registerForEvent, unregisterFromEvent, getUserRegistrations } from "../controllers/registration.controller";

export default (router: Router) => {
  router.post("/register/:eventId", authenticate, registerForEvent);
  router.delete("/unregister/:eventId", authenticate, unregisterFromEvent);
  router.get("/my-events", authenticate, getUserRegistrations);
};
