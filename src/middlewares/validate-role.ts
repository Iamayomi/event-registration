import { NextFunction, Response } from "express";
import { CustomRequest, UserRoles, sendError, verifyAuthorization } from "../library";

export const validateRoles = (allowedRoles: UserRoles[], options?: { message?: string }) => (req: CustomRequest, _: Response, next: NextFunction) => {
  const role = req.user?.role as UserRoles;

  if (!role || !allowedRoles.includes(role)) {
    sendError.unauthorizationError(options?.message || "You don't have enough permissions to access this route.");
  }

  next();
};
