import { Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";

import { CustomRequest } from "../../../library";
import { UserService, userService } from "../service";

class UserController {
  protected service: UserService;

  constructor() {
    this.service = userService;
  }

  public getProfile = async (req: CustomRequest, res: Response) => {
    const user = req.user;

    res.status(status.OK).json({ success: true, data: user });
  };

  public getAllUsers = async (req: CustomRequest, res: Response) => {
    const user = await this.service.getAllUser();

    res.status(status.OK).json({ success: true, data: user });
  };

  public getUser = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    const user = await this.service.findUserById(userId);

    res.status(status.OK).json({ success: true, data: user });
  };

  public delUser = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    const user = await this.service.delUser(userId);

    res.status(status.OK).json({ success: true, data: user });
  };
}

/** User route handlers */
export const userController = new UserController();
