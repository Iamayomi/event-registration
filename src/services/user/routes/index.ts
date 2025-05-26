import { Router } from "express";

import { authenticator } from "../../../middlewares";

import { userController } from "../controller";

/**  User Services */
export default (router: Router) => {
  /* ************* USER ROUTES ************* */

  // profile
  router.route("/user/profile").get(authenticator, userController.getProfile);
};
