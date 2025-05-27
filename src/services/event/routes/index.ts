import { Router } from "express";
import { authenticator, validate, validateRoles } from "../../../middlewares";
import * as _ from "../schema-validation";
import { eventController } from "../controller";
import { UserRoles } from "../../../library";

/**  Event Services */
export default (router: Router) => {
  /* ************* Event ROUTES ************* */
  // Create an event route
  router.post("/event", authenticator, validate(_.NewEventSchema), validateRoles([UserRoles.ADMIN]), eventController.newEvent);

  // Fetch an event route
  router.get("/event/:eventId", authenticator, eventController.getEvent);

  // Search all events route
  router.get("/events/search", authenticator, eventController.searchEvents);

  // Update event route
  router.put("/event/:eventId", authenticator, validate(_.UpdateEventSchema), validateRoles([UserRoles.ADMIN]), eventController.updateEvent);

  // Delete event route
  router.delete("/event/:eventId", authenticator, validateRoles([UserRoles.ADMIN]), eventController.delEvent);
};
