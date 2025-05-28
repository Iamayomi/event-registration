import app from "./app";
import { customEnvs, Logger } from "./library";

const PORT = customEnvs.port || 5000;

process.on("uncaughtException", (err) => {
  // Log error only in development environment
  // customEnvs.env === "development" && console.log("[API UNCAUGHTEXCEPTION ERROR]: ", err.message, "\n\nERROR STACK: ", err.stack, "\n\nTIMESTAMP: ", new Date().toLocaleTimeString());
  Logger.error(`${["API UNCAUGHTEXCEPTION ERROR: "]} ${err.message} ${"\n\nERROR STACK: "} ${err.stack}`);
});

/** Start Server only after successful connection to database */
const startServer = async () => {
  try {
    app.listen(PORT, () => Logger.success(`Server is listening on port: ${PORT}`));
  } catch (error) {
    // console.log("Something went wrong, please try again :::", error);
    Logger.error(`Something went wrong, please try again ::: \n\n${error}`);
  }
};

startServer();
