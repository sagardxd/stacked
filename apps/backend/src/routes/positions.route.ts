import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createPosition,
  getAllPositions,
  verifyPositionTx,
} from "../controllers/positions.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllPositions);
router.post("/create", createPosition);
router.post("/confirm", verifyPositionTx);

export default router;
