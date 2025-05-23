import jwt from "jsonwebtoken";

import { blue, yellow, red, magenta, green } from "colors";

import { CustomRequest, LogStatus } from "../types";
import { customEnvs, sendError } from "../../../library";

export const colorStatus = (status: LogStatus): string => {
  switch (status) {
    case "INFO":
      return blue.bold("[INFO]");
    case "WARN":
      return yellow.bold("[WARN]");
    case "ERROR":
      return red.bold("[ERROR]");
    case "SUCCESS":
      return green.bold("[SUCCESS]");
    case "DEBUG":
      return magenta.bold("[DEBUG]");
    default:
      return status;
  }
};

/**
 * Checks for an `Authorization` header in the provided `request` and verifies the token
 * @param req
 * @param errorMessage optional error message
 * @returns decoded `data` OR `error` message
 */
export const verifyAuthorization = (req: CustomRequest, message?: string) => {
  const authorization = (req.headers?.authorization || req.headers?.Authorization) as string;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    sendError.unauthenticatedError("Missing valid authorization headers");
  }

  const authToken = authorization.split(" ")[1];
  return verifyJwtToken(authToken, { message });
};

/**
 * Verifies a jwt token and returns the decoded data if verified, or an error message if token fails verification
 * @param token
 * @param secret
 * @returns decoded `data` OR `error message`
 */
export const verifyJwtToken = (token: string, options?: { message?: string }, secret: string = customEnvs.jwtSecret) => {
  try {
    const data = jwt.verify(token, secret);

    if (data && typeof data !== "string") return { data };
  } catch (err: any) {
    let message = "Invalid Token.";

    if (err?.message?.toLowerCase()?.includes("expired")) {
      message = options?.message || "Hey champ! Your session expired, please login again.";
    }

    return {
      error: message,
    };
  }
};
