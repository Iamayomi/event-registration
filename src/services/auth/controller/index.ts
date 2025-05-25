import { Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { CustomRequest, createEmailVerificationToken } from "../../../library";
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
   * Handles registration of the various accounts including `user` and `admin` accounts
   * @route {POST} /api/v1/auth/register
   * @access public
   */
  public signUp = async (req: CustomRequest, res: Response) => {
    const payload = req.body;

    const newUser = await this.service.createUser(payload);

    const { name, email, code } = createEmailVerificationToken(newUser);

    const mailOptions = emailVerificationTemplate(name, code);

    await this.mail.viaNodemailer({ ...mailOptions, to: email });

    res.status(status.CREATED).json({
      success: true,
      message: `Registration successful. Verify your email with the code that was sent to ${obscureEmail(email)}`,
    });
  };
}

/** Auth route handlers */
export const authController = new AuthController();
