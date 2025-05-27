import { Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { CustomRequest, TIME_IN, createAccessToken, createVericationToken, emailVerificationResendTemplate, newPasswordSuccessTemplate, resetPasswordTemplate } from "../../../library";
import { UserService, userService } from "../../../services/user/service";

import { Email, obscureEmail, emailVerificationTemplate, sendError, verifyAuthorization } from "../../../library";

class AuthController {
  protected service: UserService;
  private mail: Email;

  constructor() {
    this.service = userService;
    this.mail = new Email();
  }

  /**
   * Handles registration for `user` and `admin` accounts
   * @route {POST} /api/v1/auth/register
   * @access public
   */
  public register = async (req: CustomRequest, res: Response) => {
    const data = req.body;

    const newUser = await this.service.createUser(data);
    // console.log(newUser);

    const { name, email, token, code } = createVericationToken(newUser);

    const mailOptions = emailVerificationTemplate(name, code);

    await this.mail.viaNodemailer({ ...mailOptions, to: email });

    res.setHeader("Authorization", token);

    res.status(status.CREATED).json({
      success: true,
      message: `Registration successful. Verify your email with the code that was sent to ${obscureEmail(email)}`,
    });
  };

  /**
   * Handles user login
   * @route {POST} /api/v1/auth/login
   * @access public
   */
  public logIn = async (req: CustomRequest, res: Response) => {
    const data = req.body;

    const userData: any = await this.service.authenticate(data);

    let token = createAccessToken(userData);

    if (!userData?.isEmailVerified) {
      const { name, email, token, code } = createVericationToken(userData);

      const mailOptions = emailVerificationTemplate(name, code);

      await this.mail.viaNodemailer({ ...mailOptions, to: email });

      res.setHeader("Authorization", token);

      res.status(status.FORBIDDEN).json({
        success: true,
        message: `Your email has not been verified. Use the code that was sent to ${obscureEmail(email)}`,
      });
    }

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  };

  /**
   * Handles verification of email after signup
   * @route {POST} /api/v1/auth/verify-email
   * @access public
   */
  public verifyEmail = async (req: CustomRequest, res: Response) => {
    const { verification_code } = req.body;

    const authData = verifyAuthorization(req, "That code was valid for 1 hour. Please try again.");

    if (authData?.error) sendError.unauthorizationError(authData.error);

    const userData = await this.service.authenticateEmail({
      ...authData?.data,
      verification_code,
    });

    const token = createAccessToken(userData);

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: "Email verification successful",
      data: userData,
    });
  };

  /**
   * Handles initialization of request to reset user password
   * @route {POST} /api/v1/auth/forgot-password
   * @access public
   */
  public forgotPassword = async (req: CustomRequest, res: Response) => {
    const { email } = req.body;

    const userData: any = await this.service.findUserByEmail(email);

    const { code, name, token } = createVericationToken(userData, TIME_IN.minutes[15]);

    const mailOptions = resetPasswordTemplate(name, code);

    await this.mail.viaNodemailer({ ...mailOptions, to: email });

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: `A code has been sent to ${obscureEmail(email)}`,
    });
  };

  /**
   * Handles verification of reset password code
   * @route {POST} /api/v1/auth/verify-email
   * @access public
   */
  public verifyPasswordResetCode = async (req: CustomRequest, res: Response) => {
    const payload = req.body;

    const authData = verifyAuthorization(req, "That code was valid for 15 minutes. Please try again.");

    if (authData?.error) sendError.unauthorizationError(authData?.error);

    const token = await this.service.verifyPasswordResetCode({
      ...authData?.data,
      ...payload,
    });

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: "You rock! Now, let's create you a new password.",
    });
  };

  /**
   * Handles request to resend email verification code
   * @route {GET} /api/v1/auth/email/resend-code
   * @access public
   */
  public resendEmailVerificationCode = async (req: CustomRequest, res: Response) => {
    const authData = verifyAuthorization(req);

    if (authData?.error) sendError.unauthorizationError(authData?.error);

    if (!authData?.data?.email) sendError.unauthorizationError();

    const userData = await this.service.findUserByEmail(authData?.data?.email);

    const { token, name, email, code } = createVericationToken(userData);

    const mailOptions = emailVerificationResendTemplate(name, code);

    await this.mail.viaNodemailer({
      ...mailOptions,
      to: email,
    });

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: `A code has been sent to ${obscureEmail(email)}`,
    });
  };

  /**
   * Handles resetting forgotten password
   * @route {PUT} /api/v1/auth/reset-password
   * @access public
   */
  public resetPassword = async (req: CustomRequest, res: Response) => {
    const payload = req.body;

    const authData = verifyAuthorization(req);
    if (authData?.error) sendError.unauthorizationError(authData.error);

    if (!authData?.data?.userId) sendError.unauthorizationError();

    const userData = await this.service.resetPassword({
      ...authData?.data,
      ...payload,
    });

    const token = createAccessToken(userData);

    const mailOptions = newPasswordSuccessTemplate(userData.name);

    await this.mail.viaNodemailer({ ...mailOptions, to: userData.email });

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: "Voila! Your password was changed successfully",
      data: userData,
    });
  };

  /**
   * Handles request to resend code used to initiate resetting forgotten password
   * @route {GET} /api/v1/auth/password/resend-code
   * @access public
   */
  public resendPasswordResetCode = async (req: CustomRequest, res: Response) => {
    const authData = verifyAuthorization(req);

    if (authData?.error) sendError.unauthorizationError(authData.error);

    if (!authData?.data?.email) sendError.unauthorizationError();

    const userData = await this.service.findUserByEmail(authData?.data?.email);

    const { code, name, email, token } = createVericationToken(userData, TIME_IN.minutes[15]);

    const mailOptions = resetPasswordTemplate(name, code);

    await this.mail.viaNodemailer({
      ...mailOptions,
      to: email,
    });

    res.setHeader("Authorization", token);

    res.status(status.OK).json({
      success: true,
      message: `A code has been sent to ${obscureEmail(email)}`,
    });
  };
}

/** Auth route handlers */
export const authController = new AuthController();
