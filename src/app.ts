import express from "express";
// import cors from "cors";
// import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import router from "./apis/router";
// import router from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());
// console.log(router);

app.use("/api/v1", router());
// app.use("/api/v1", router);

// app.use("/api/events", eventRoutes);
// app.use("/api/registrations", registrationRoutes);

app.use(errorHandler);

export default app;
