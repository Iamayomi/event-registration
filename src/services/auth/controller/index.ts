import { Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { CustomRequest } from "../../../library";
import { UserService, userService } from "../../../services/user/service";

class AuthController {
  protected service: UserService;

  constructor() {
    this.service = userService;
  }

  /**
   * Handles registration of the various accounts including `user` and `admin` accounts
   * @route {POST} /api/v1/auth/register
   * @access public
   */
  public signUp = async (req: Request, res: Response) => {
    const payload = req.body;

    const newUser = await this.service.createUser(payload);

    res.status(status.CREATED).json({
      success: true,
      message: `Registration successful.`,
      data: newUser,
    });
  };
}

/** Auth route handlers */
export const authController = new AuthController();
