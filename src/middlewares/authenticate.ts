import { Response, NextFunction } from "express";
import { sendError, verifyAuthorization } from "../library";
import { prisma } from "../prisma/client";

export const authenticator = async (req: any, res: Response, next: NextFunction) => {
  const { data, error } = verifyAuthorization(req);

  if (error) sendError.unauthorizationError(error);

  const user: any = await prisma.user.findUnique({
    where: { id: data?.userId },
  });

  if (!user) sendError.unauthorizationError();

  // Populate req.user
  req.user = user;

  next();
};
