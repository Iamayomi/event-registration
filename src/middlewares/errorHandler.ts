import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { StatusCodes as status } from "http-status-codes";
import { customEnvs } from "../library";
import { CustomError } from "../library/error/errors";

/**
 * This is a custom middleware that handles all errors thrown within or outside an asynchronous function call.
 *
 * Note that throughout the app, there was no need to wrap most asynchronous function calls within a try-catch block due to the presence of 'express-async-error' module declared at the top of the app entry -- This module is equivalent to wrapping the entire app within a try-catch block as it automatically throws any error arising from all asynchronous actions which then gets caught up and handled by this errorHandler.
 *
 * @returns Server Response */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  customEnvs.env === "development" && console.log("[API ERROR]: ", err.message, "\n\nERROR STACK: ", err.stack, "\n\nTIMESTAMP: ", new Date().toLocaleTimeString());

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ success: false, message: err.message, data: err.data });
  }

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

  if (err instanceof CustomError && err?.code === "EAUTH")
    res.status(status.BAD_GATEWAY).json({
      success: false,
      message: err.message,
      data: err.data,
    });

  // res.status(status.INTERNAL_SERVER_ERROR).json({
  //   success: false,
  //   message: "Internal server error",
  // });
};
