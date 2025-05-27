import { Router } from "express";
import { validate } from "../../../middlewares";
import * as _ from "../schema-validation";
import { authController } from "../controller";

/**  Auth Services */
export default (router: Router) => {
  /* ************* AUTHENTICATION ROUTES ************* */
  // sign-up
  router.post("/auth/register", validate(_.SignUpDataSchema), authController.register);

  // verify email
  router.post("/auth/verify-email", validate(_.VerifyEmailDataSchema), authController.verifyEmail);

  // login
  router.post("/auth/login", validate(_.LoginDataSchema), authController.logIn);

  // forgot password
  router.post("/auth/forgot-password", validate(_.EmailDataSchema), authController.forgotPassword);

  // verify password-reset code
  router.post("/auth/verify-password-reset-code", validate(_.ResetPasswordSchema), authController.verifyPasswordResetCode);

  // resend emai verification code
  router.get("/auth/email/resend-code", authController.resendEmailVerificationCode);

  // password-reset
  router.put("/auth/reset-password", validate(_.NewPasswordSchema), authController.resetPassword);
};
