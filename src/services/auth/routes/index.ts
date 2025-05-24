import { Router } from "express";
import { validate } from "../../../middlewares/validation";
import * as _ from "../schema-validation";
import { authController } from "../controller/index";

/**  Auth Services */
export default (router: Router) => {
  /* ************* AUTHENTICATION ROUTES ************* */
  // sign-up
  router.post("/auth/register", validate(_.SignUpDataSchema), authController.signUp);
};
