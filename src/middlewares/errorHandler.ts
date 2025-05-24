import { Request, Response, NextFunction } from "express";
import { StatusCodes as status } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { customEnvs } from "../library";

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
  customEnvs.env === "development" && console.log("[API ERROR]: ", err.message, "\n\nERROR STACK: ", err.stack, "\n\nTIMESTAMP: ", new Date().toLocaleTimeString());

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(status.CONFLICT).json({
        success: false,
        message: `Duplicate field ${err.meta?.target}`,
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(status.BAD_REQUEST).json({
      success: false,
      message: "validation failed for request data.",
    });
  }
  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
  });
}
