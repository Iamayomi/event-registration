import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ShortUniqueId from "short-unique-id";

import { blue, yellow, red, magenta, green } from "colors";

import { CustomRequest, Days, Hours, LogStatus, Minutes, TimeInMilliseconds } from "../types";
import { TIME_IN, customEnvs, sendError } from "../../../library";

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
 * Function obscures an email address
 * @param email string
 * @example 's******@gmail.com'
 * @returns Obscured email
 */
export const obscureEmail = (email: string) => {
  if (email) {
    const [name, domain] = email.split("@");
    const l = name.length;
    if (l > 2) {
      return `${name[0]}${new Array(l - 1).join("*")}${name[l - 1]}@${domain}`;
    } else {
      return `${name[0]}${new Array(l).join("*")}@${domain}`;
    }
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
export const verifyJwtToken = (token: string, options?: { message?: string }, secret: string = customEnvs.jwtSecret): { data?: any; error?: string } => {
  try {
    const data = jwt.verify(token, secret);

    if (data && typeof data !== "string") {
      return { data };
    }
    return { error: "Invalid token payload" };
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

/**
 * Used to generate random positive integers of length, 4 by default, otherwise the passed in length, and expiration time for the code which by default is 15 minutes, otherwise the passed in expiration time.
 * @param length
 * @param exp Code expiration time in `minutes` [15 minutes by default] expressed in milliseconds
 * @returns random code [positive integers] and expiration time
 */

export function getRandomNumbers(length: number = 6, exp: number = 15) {
  const { randomUUID } = new ShortUniqueId({
    length,
    dictionary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  });

  const code = randomUUID();
  //set code expiration
  const expiresAt = Date.now() + exp * 60 * 1000; // by default, code expires 15 minutes after it's generated.

  return {
    /** Random number */
    code: +code,
    /** Code expiration time expressed in `milliseconds` */
    expiresAt,
  };
}

/** Generates and returns an object whose keys in number represent ***time*** in `hour` and values expressed in `milliseconds`
 * @description Ranges from 1 to 24 ***hours***
 */
export const generateHours = (): TimeInMilliseconds<Hours> => {
  const hours = {} as TimeInMilliseconds<Hours>;
  for (let i = 1; i <= 24; i++) {
    hours[i as keyof typeof hours] = i * 60 * 60 * 1000; // Convert hours to milliseconds
  }
  return hours;
};

/** Generates and returns an object whose keys in number represent ***time*** in `day` and values expressed in `milliseconds`
 * @description Ranges from 1 to 7 ***days***
 */
export const generateDays = (): TimeInMilliseconds<Days> => {
  const days = {} as TimeInMilliseconds<Days>;
  for (let i = 1; i <= 7; i++) {
    days[i as keyof typeof days] = i * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  }
  return days;
};

/** Generates and returns an object whose keys in number represent ***time*** in `minute` and values expressed in `milliseconds`
 * @description Ranges from 1 to 59 ***minutes***
 */
export const generateMinutes = (): TimeInMilliseconds<Minutes> => {
  const minutes = {} as TimeInMilliseconds<Minutes>;
  for (let i = 1; i <= 59; i++) {
    minutes[i as keyof typeof minutes] = i * 60 * 1000; // Convert minutes to milliseconds
  }
  return minutes;
};

/**
 * Creates a signed JWT access token for authentication.
 *
 * @param user - The user object containing required fields: id, email, and role
 * @param expiresAt - Optional expiration time (default is 3 days)
 * @returns JWT string
 */
export const createAccessToken = function (user: any, expiresAt: number = TIME_IN.days[3]) {
  return jwt.sign({ userId: user.id, role: user.role, email: user.email }, customEnvs.jwtSecret, {
    expiresIn: `${expiresAt}`,
  });
};

/**
 * Generates a random email verification code and a signed JWT token for verification.
 *
 * @param user - The user object, must contain id, name, email, and role
 * @param length - Optional length for the numeric verification code
 * @param exp - Optional expiration time for the token (currently unused)
 * @returns An object with the code, user info, and the JWT token
 */

export const createVericationToken = function (user: any, length?: number, exp?: number) {
  const { code } = getRandomNumbers(length);

  const data = {
    code,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(data, customEnvs.jwtSecret, { expiresIn: `${exp || TIME_IN.hours[1]}` });

  return { ...data, token };
};

export const verifyPassword = async function (user: any, password: string) {
  return await bcrypt.compare(password, user.password);
};
