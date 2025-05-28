import bcrypt from "bcryptjs";
import { createAccessToken, sendError, verifyPassword } from "../../../library";
import { prisma } from "../../../prisma/client";
import { Prisma } from "@prisma/client";

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

    return await this.userModel.create({ data });
  }

  /**
   * @note Authentication is the process of *verifying* the **identity** of the client making a request to the server. This `function` therefore is for validating the provided `data` against the database.
   * @param data *{ email, password }*
   * @returns User Document
   */
  public async authenticate({ ...data }) {
    const foundUser: any = await this.findUserByEmail(data.email);

    if (!foundUser) sendError.unauthorizationError(`Invalid email or password!`);

    const passwordIsValid = await verifyPassword(foundUser, data.password);

    if (!passwordIsValid) sendError.unauthorizationError(`Invalid email or password!`);

    return foundUser;
  }

  /** Authenticates user email */
  public async authenticateEmail(data: any) {
    if (data?.verification_code.toString() !== data?.code.toString()) sendError.badrequestError("Oops! That code was not a match, try again.");

    await this.updateEmailStatus(data.email, true);
  }

  /** Verifies code for request to reset forgotten password
   * @returns access token
   */
  public async verifyPasswordResetCode(data: any) {
    const foundUser = await this.findUserByEmail(data.email);

    if (data.password_reset_code.toString() !== data.code.toString()) sendError.badrequestError("Oops! That code was not a match, try again.");

    if (Date.now() > data.expiresAt) sendError.badrequestError("Sorry, that code expired. Try again.");

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
    return await this.userModel.findUnique({ where: { email } });
  }

  /** Find all users
   * @returns User Document */
  public async getAllUser(query?: Record<string, any>) {
    const { sort, fields, role, isEmailVerified } = query || {};

    /** Get all users with optional sorting, pagination, filtering, and field selection */
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    if (query?.page < 1 || query?.limit < 1) sendError.badrequestError("'limit' or 'page' query params must be positive numbers");

    const skip = (page - 1) * limit;

    // Sorting: sort=name:asc or sort=createdAt:desc
    let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: "desc" };
    if (sort) {
      const [field, direction] = sort.split(":"); // e.g. sort=name:asc
      orderBy = { [field]: direction === "asc" ? "asc" : "desc" };
    }

    // Filtering
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (typeof isEmailVerified !== "undefined") {
      where.isEmailVerified = isEmailVerified === "true";
    }

    // Field Selection
    let select: Prisma.UserSelect | undefined;
    if (fields) {
      const fieldArray = fields.split(",");
      select = fieldArray.reduce((acc: any, field: string) => {
        acc[field.trim()] = true;
        return acc;
      }, {});
    }

    const users = await this.userModel.findMany({
      where,
      orderBy,
      take: limit,
      skip,
      select,
    });

    const total = await this.userModel.count({ where });

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: users,
    };
  }

  //   async findUserById() {
  //     return this.userModel.findMany(args);
  //   }

  /** Get a user by id
   * @returns User Document */
  public async findUserById(id: string) {
    return await this.userModel.findUnique({ where: { id } });
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
    const user = await this.findUserByEmail(email);

    if (!user) sendError.notfoundError("User was not found");

    return this.userModel.update({
      where: { email: user?.email },
      data: {
        isEmailVerified: val,
      },
    });
  }

  /** Delete user by id */
  public async delUser(id: string) {
    const user = await this.findUserById(id);

    if (!user) sendError.notfoundError("That User was not found");

    await this.userModel.delete({ where: { id: user?.id } });
  }
}

/**
 * Instance of the UserService class used to handle user-related database queries
 * @instance {UserService} */
export const userService = new UserService();
