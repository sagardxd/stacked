import express from "express";
import cors from "cors";

import validatorRoutes from "./routes/validator.route";
import authRoutes from "./routes/auth.route";
import { startCron } from "./workers/cron";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/validator", validatorRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  startCron();
});