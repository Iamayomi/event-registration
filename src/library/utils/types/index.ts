import { Prisma } from "@prisma/client";
import { Request } from "express";

export type ErrorData = Record<string, any>;

export type LogStatus = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "DEBUG";

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}
export interface CustomRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  body: {
    name: string;
    email: string;
    password: string;
    isEmailVerified?: boolean;
    title: string;
    description: string;
    verification_code: string;
    date: Date;
    capacity: number;
    eventId: string;
  };
  params: {
    eventId?: string;
    userId?: string;
    registerId?: string;
  };
}

// export interface CustomRequest extends Request {
//   prisma: PrismaClient;
//   user: {
//     userId: string;
//     roles: UserRoles[];
//   };
//   session: {
//     user: Prisma.UserGetPayload<{
//       include: { registrations: true };
//     }>;
//     event?: Prisma.EventGetPayload<{
//       include: { registrations: { include: { user: true } } };
//     }>;
//     registration?: Prisma.RegistrationGetPayload<{
//       include: { user: true; event: true };
//     }>;
//   };
//   files?: {
//     avatar?: UploadedFile;
//     [key: string]: UploadedFile | UploadedFile[] | undefined;
//   };
// }

export interface JwtUserPayload {
  id: string | number;
  email: string;
  role: string;
}

export interface JwtEmailPayload {
  code: string;
  name: string;
  user: JwtUserPayload;
}

// mail options
export interface MailOptions {
  to: string;
  html: string;
  subject: string;
  from?: string;
  text?: string;
  fromName?: string;
  attachments?: any;
  template?: string;
  context?: MailContext;
}

export type MailContext = {
  fullName?: string;
  username?: string;
  email?: string;
  company?: string;
  riderId?: string;
  pasword?: string;
  code?: string;
  expiresIn?: number | string;
  extLink?: string;
  otherLinks?: string;
  date?: string;
  baseUrl?: string;

  [key: string]: any;
};

export type Minutes =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59;

export type Hours = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

export type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TimeInMilliseconds<T extends string | number | symbol> = {
  [key in T]: number;
};
