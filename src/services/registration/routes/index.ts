import { Router } from "express";
import { authenticator } from "../../../middlewares";
import { registerController } from "../controller";

/**  Register Services */
export default (router: Router) => {
  /* ************* Register ROUTES ************* */
  // Register for an event route
  router.post("/register/:eventId", authenticator, registerController.registerForEvent);

  // Fetch user registered event route
  router.get("/register/:userId", authenticator, registerController.getRegisterEvent);

  // Fetch user all registered event route
  router.get("/registers/:userId", authenticator, registerController.getRegisterEvents);

  // Unregister event route
  router.delete("/unregister/:registerId", authenticator, registerController.unregisterEvent);
};
