import { StatusCodes as status } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

// import { CustomRequest } from "../";
import { sendError } from "../library";

export const verifyRecaptcha = async (req: Request, _: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "production") {
    // captcha key
    const { RECAPTCHA_SERVER_KEY } = process.env;

    // human key
    const humanKey = req.headers?.grecaptcha;

    // check if captcha token is available
    if (!humanKey) sendError.unauthenticatedError("Please, provide a valid captcha token");

    // Validate Human
    const isHuman = await fetch(
      "https://www.google.com/recaptcha/api/siteverify", // hcaptcha :: https://hcaptcha.com/siteverify
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`,
      }
    )
      .then((res) => res.json())
      .then((json: any) => json?.success)
      .catch(() => {
        sendError.unauthorizationError("Invalid captcha token");
      });

    // The code below will run only after the reCAPTCHA is succesfully validated.
    next();
  }

  next();
};
