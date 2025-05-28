import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import router from "./apis/router";
import { errorHandler, rateLimiter } from "./middlewares";
import { corsOptions } from "./library";

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.json({ limit: "15mb", type: "application/json" }));
app.use(helmet());
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1", router());

app.use(errorHandler);

export default app;
