import { Router } from "express";

import { authenticator, validateRoles } from "../../../middlewares";

import { userController } from "../controller";
import { UserRoles } from "../../../library";

/**  User Services */
export default (router: Router) => {
  /* ************* USER ROUTES ************* */

  // Get user profile
  router.route("/user/profile").get(authenticator, userController.getProfile);

  // Get a user
  router.route("/user/:userId").get(authenticator, userController.getUser);

  // Search all users
  router.get("/users/search", authenticator, validateRoles([UserRoles.ADMIN]), userController.getAllUsers);

  // Delete user
  router.delete("/user/:userId", authenticator, validateRoles([UserRoles.ADMIN]), userController.delUser);
};
