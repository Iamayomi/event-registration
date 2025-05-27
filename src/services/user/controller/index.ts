import { Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";

import { CustomRequest } from "../../../library";
import { UserService, userService } from "../service";

class UserController {
  protected service: UserService;

  constructor() {
    this.service = userService;
  }

  /**
   * Handle get a user profile request
   * @route {GET} /api/v1/user/profile
   * @access public
   */
  public getProfile = async (req: CustomRequest, res: Response) => {
    const user = req.user;

    res.status(status.OK).json({ success: true, message: "User Profile Get Successfully", data: user });
  };

  /**
   * Handle Fetch users request
   * @route {GET} /api/v1/user/search
   * @access public
   */
  public getAllUsers = async (req: CustomRequest, res: Response) => {
    const query = req.query;

    const data = await this.service.getAllUser(query);

    res.status(status.OK).json({ success: true, message: "Fetch Uers Successfully", ...data });
  };

  /**
   * Handle get a user request
   * @route {GET} /api/v1/user/:userId
   * @access public
   */
  public getUser = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    const user = await this.service.findUserById(userId);

    res.status(status.OK).json({ success: true, message: "Fetch a User Successfully", data: user });
  };

  /**
   * Handle delete a user request
   * @route {DELETE} /api/v1/user/:userId
   * @access public
   */
  public delUser = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    await this.service.delUser(userId);

    res.status(status.NO_CONTENT).json({ success: true, message: "User Deleted Successfully" });
  };
}

/** User route handlers */
export const userController = new UserController();
