import { generateDays, generateHours, generateMinutes } from "../../utils";
import { customEnvs } from "../env";

export const BASE_URL = customEnvs.baseUrl;

export const APP_NAME = "EVENT REGISTRATION";

/** Time in `minute`, ` hour` and `day` expressed in `milliseconds` */
export const TIME_IN = {
  /** Time in `minutes` expressed in `milliseconds` */
  minutes: generateMinutes(),
  /** Time in `hours` expressed in `milliseconds` */
  hours: generateHours(),
  /** Time in `days` expressed in `milliseconds` */
  days: generateDays(),
};
