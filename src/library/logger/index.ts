import { LogStatus, colorStatus } from "../utils";

const getTimestamp = (): string => {
  return new Date().toISOString();
};

export class Logger {
  private static log(status: LogStatus, message: string) {
    const timestamp = getTimestamp().gray;
    const levelTag = colorStatus(status);
    console.log(`${timestamp} ${levelTag} ${message}`);
  }

  static info(message: string) {
    this.log("INFO", message);
  }

  static warn(message: string) {
    this.log("WARN", message);
  }

  static error(message: string) {
    this.log("ERROR", message);
  }

  static success(message: string) {
    this.log("SUCCESS", message);
  }

  static debug(message: string) {
    if (process.env.NODE_ENV === "development") {
      this.log("DEBUG", message);
    }
  }
}
