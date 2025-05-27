import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";
import authenticationRoutes from "../services/auth/routes";
import userRoutes from "../services/user/routes";
import eventRoutes from "../services/event/routes";

const router = Router();

/** App router.
 * @returns all the routes for the entire app */
export default () => {
  /** auth routes */
  authenticationRoutes(router);

  /** user routes */
  userRoutes(router);

  /** event routes */
  eventRoutes(router);

  /** Catch all route handler */
  router.use((_, res) => {
    res.status(status.NOT_FOUND).send({
      message: "The requested route does not exist, please try again.",
    });
  });

  return router;
};
