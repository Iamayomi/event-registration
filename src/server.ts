import app from "./app";
import { customEnvs } from "./library/config";

const PORT = customEnvs.port || 5000;

process.on("uncaughtException", (err) => {
  // Log error only in development environment
  customEnvs.env === "development" && console.log("[API UNCAUGHTEXCEPTION ERROR]: ", err.message, "\n\nERROR STACK: ", err.stack, "\n\nTIMESTAMP: ", new Date().toLocaleTimeString());
});

/** Start Server only after successful connection to database */
const startServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
  } catch (error) {
    console.log("Something went wrong, please try again :::", error);
  }
};

startServer();
