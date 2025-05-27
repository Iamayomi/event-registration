import bcrypt from "bcryptjs";
import { createAccessToken, sendError, verifyPassword } from "../../../library";
import { prisma } from "../../../prisma/client";

/** User service class. */
export class UserService {
  constructor(private userModel = prisma.user) {}

  public async createUser(payload: any) {
    const userExist = await this.findUserByEmail(payload.email);

    if (userExist) {
      sendError.duplicateRequestError("Email already in use. Please log in, or try again.");
    }

    const decodePwd = await bcrypt.hash(payload.password, 10);

    const data = { ...payload, password: decodePwd };

    await this.userModel.create({ data });
  }

  /**
   * @note Authentication is the process of *verifying* the **identity** of the client making a request to the server. This `function` therefore is for validating the provided `data` against the database.
   * @param data *{ email, password }*
   * @returns User Document
   */
  public async authenticate({ ...data }) {
    const foundUser = await this.findUserByEmail(data.email);

    if (!foundUser) sendError.unauthorizationError(`Invalid email or password!`);

    const passwordIsValid = await verifyPassword(foundUser, data.password);

    if (!passwordIsValid) sendError.unauthorizationError(`Invalid email or password!`);

    return foundUser;
  }

  /** Authenticates user email */
  public async authenticateEmail(data: any) {
    if (data?.verification_code.toString() !== data?.code.toString()) sendError.BadRequestError("Oops! That code was not a match, try again.");

    await this.updateEmailStatus(data.email, true);
  }

  /** Verifies code for request to reset forgotten password
   * @returns access token
   */
  public async verifyPasswordResetCode(data: any) {
    const foundUser = await this.findUserByEmail(data.email);

    if (data.password_reset_code.toString() !== data.code.toString()) sendError.BadRequestError("Oops! That code was not a match, try again.");

    if (Date.now() > data.expiresAt) sendError.BadRequestError("Sorry, that code expired. Try again.");

    return createAccessToken(foundUser);
  }

  /** Reset user password
   * @returns User Document */
  public resetPassword = async (data: any) => {
    const foundUser = await this.findUserById(data.userId);

    if (!foundUser) sendError.notfoundError("Sorry, we could not find this user in our database");

    const decodePwd = await bcrypt.hash(data.new_password, 10);

    return await this.updateUserPassword(data.userId, decodePwd);
  };

  public async findUserByEmail(email: string) {
    return this.userModel.findUnique({ where: { email } });
  }

  //   async findUserById() {
  //     return this.userModel.findMany(args);
  //   }

  public async findUserById(id: string) {
    return this.userModel.findUnique({ where: { id } });
  }

  /** Updates user password
   * @returns User Document */
  public async updateUserPassword(id: string, val: string) {
    return this.userModel.update({
      where: { id },
      data: {
        password: val,
      },
    });
  }

  /** Updates user email status
   * @returns User Document */
  public async updateEmailStatus(email: string, val: boolean) {
    return this.userModel.update({
      where: { email },
      data: {
        isEmailVerified: val,
      },
    });
  }

  public async delUser(id: string) {
    return this.userModel.delete({ where: { id } });
  }
}

/**
 * Instance of the UserService class used to handle user-related database queries
 * @instance {UserService} */
export const userService = new UserService();
