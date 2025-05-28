import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";
import authRoutes from "../services/auth/routes";
import userRoutes from "../services/user/routes";
import eventRoutes from "../services/event/routes";
import registerRoutes from "../services/registration/routes";

const router = Router();

/** App router.
 * @returns all the routes for the entire app */
export default () => {
  /** auth routes */
  authRoutes(router);

  /** user routes */
  userRoutes(router);

  /** event routes */
  eventRoutes(router);

  /** register routes */
  registerRoutes(router);

  /** Catch all route handler */
  router.use((_, res) => {
    res.status(status.NOT_FOUND).send({
      message: "The requested route does not exist, please try again.",
    });
  });

  return router;
};
