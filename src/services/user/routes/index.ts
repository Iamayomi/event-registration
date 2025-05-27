import { Router } from "express";

import { authenticator, validateRoles } from "../../../middlewares";

import { userController } from "../controller";
import { UserRoles } from "../../../library";

/**  User Services */
export default (router: Router) => {
  /* ************* USER ROUTES ************* */

  // profile
  router.route("/user/profile").get(authenticator, userController.getProfile);

  // get a user
  router.route("/user/:userId").get(authenticator, userController.getUser);

  // admin get all users
  router.get("/admin/get-users", authenticator, validateRoles([UserRoles.ADMIN]), userController.getAllUsers);

  // admin delete user
  router.delete("/admin/del-user/:userId", authenticator, userController.delUser);
};
