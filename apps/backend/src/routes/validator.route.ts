import express from "express";
import { getValidatorById, getValidators } from "../controllers/validator.controller";
const router = express.Router();


router.get("/", getValidators);
router.get("/:id", getValidatorById)

export default router;