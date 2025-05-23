import { Request } from "express";

export type ErrorData = Record<string, any>;

export type LogStatus = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "DEBUG";

export interface CustomRequest extends Request {
  user?: {
    userId: string;
    email?: string;
  };
  body: {
    name?: string;
    email?: string;
    password?: string;
    title?: string;
    desc?: string;
    date?: string;
    capacity?: number;
    eventId?: string;
  };
  params: {
    eventId?: string;
    userId?: string;
  };
}
