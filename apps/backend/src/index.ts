import express from "express";
import cors from "cors";
import {config} from "@repo/config";

import validatorRoutes from "./routes/validator.route";
import authRoutes from "./routes/auth.route";
import positionsRoutes from "./routes/positions.route";
import { startCron } from "./workers/cron";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
 return res.send("hey")
});

app.use("/api/auth", authRoutes);
app.use("/api/validators", validatorRoutes);
app.use("/api/positions", positionsRoutes);

app.listen(config.PORT_BACKEND, () => {
  console.log(`Server is running on http://localhost:${config.PORT_BACKEND}`);
  startCron();
});