import { sendError } from "../../../library";
import { prisma } from "../../../prisma/client";

/** User service class. */
export class UserService {
  constructor(private userModel = prisma.user) {}

  public async createUser(data: any) {
    const userExist = await this.findUserByEmail(data.email);

    if (userExist) {
      sendError.duplicateRequestError("Email already in use. Please log in, or try again.");
    }

    return this.userModel.create({ data });
  }

  public async findUserByEmail(email: string) {
    return this.userModel.findUnique({ where: { email } });
  }
  //   async findUserById() {
  //     return this.userModel.findMany(args);
  //   }

  public async findUserById(id: string) {
    return this.userModel.findUnique({ where: { id } });
  }

  public async updateUser(id: string, data: any) {
    return this.userModel.update({ where: { id }, data });
  }

  public async delUser(id: string) {
    return this.userModel.delete({ where: { id } });
  }
}

/**
 * Instance of the UserService class used to handle user-related database queries
 * @instance {UserService} */
export const userService = new UserService();
