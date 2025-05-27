import { sendError } from "../../../library";
import { prisma } from "../../../prisma/client";

/** Registration service class. */
export class RegistrationService {
  constructor(private registrationModel = prisma.registration) {}

  public async createResgister(data: any) {
    await this.registrationModel.create({ data });
  }

  //   async findUserById() {
  //     return this.registrationModel.findMany(args);
  //   }

  public async findUserById(id: string) {
    return this.registrationModel.findUnique({ where: { id } });
  }

  /** Updates user password
   * @returns User Document */
  //   public async updateUserPassword(id: string, val: string) {
  //     return this.registrationModel.update({
  //       where: { id },
  //       data: {
  //         password: val,
  //       },
  //     });
  //   }

  /** Updates user email status
   * @returns User Document */
  //   public async updateEmailStatus(email: string, val: boolean) {
  //     return this.registrationModel.update({
  //       where: { email },
  //       data: {
  //         isEmailVerified: val,
  //       },
  //     });
  //   }

  public async delUser(id: string) {
    return this.registrationModel.delete({ where: { id } });
  }
}

/**
 * Instance of the RegistrationService class used to handle user-related database queries
 * @instance {RegistrationService} */
export const registrationService = new RegistrationService();
