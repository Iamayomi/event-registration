import { Response, NextFunction } from "express";
import { sendError, verifyAuthorization } from "../library";
import { prisma } from "../prisma/client";

export const authenticator = async (req: any, res: Response, next: NextFunction) => {
  const authData = verifyAuthorization(req);

  if (authData?.error) sendError.unauthorizationError(authData.error);

  const user: any = await prisma.user.findUnique({
    where: { id: authData?.data?.userId },
  });

  if (!user) sendError.unauthorizationError();

  // // Populate req.user
  req.user = user;

  next();
};
