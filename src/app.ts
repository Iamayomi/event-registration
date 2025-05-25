import express from "express";
import "dotenv/config";
// import cors from "cors";
// import morgan from "morgan";
import helmet from "helmet";

import router from "./apis/router";
import { errorHandler } from "./middlewares";

const app = express();

// app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", router());

app.use(errorHandler);

export default app;
