import express from "express";
// import cors from "cors";
// import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import router from "./router/index";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", router());
// app.use("/api/events", eventRoutes);
// app.use("/api/registrations", registrationRoutes);

app.use(errorHandler);

export default app;
