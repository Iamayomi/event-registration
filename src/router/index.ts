import { Router, Request, Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import authentiactionRoutes from "../routes/auth.route";

const router = Router();

/** App router.
 * @returns all the routes for the entire app */
export default () => {
  /** auth routes */
  authentiactionRoutes(router);

  /** Catch all route handler */
  //   router.use((_, res) => {
  //     return res.status(status.NOT_FOUND).send({
  //       message: "The requested route does not exist, please try again.",
  //     });
  //   });

  return router;
};
