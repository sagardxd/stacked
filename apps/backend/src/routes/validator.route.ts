import express from "express";
import { getValidatorById, getValidators } from "../controllers/validator.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getValidators);
router.get("/:id", getValidatorById);

export default router;