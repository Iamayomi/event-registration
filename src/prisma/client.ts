import { PrismaClient } from "@prisma/client";

export class PrismaConnection extends PrismaClient {
  constructor() {
    super();
    this.$connect()
      .then(() => console.log("Prisma connected successfully."))
      .catch((err) => {
        console.error("Prisma connection error:", err);
        process.exit(1);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks() {
    process.on("SIGINT", async () => {
      console.log("SIGINT received. Closing Prisma...");
      await this.$disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Closing Prisma...");
      await this.$disconnect();
      process.exit(0);
    });
  }
}

export const prisma = new PrismaConnection();

export default prisma;
