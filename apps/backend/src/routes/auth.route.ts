import express from "express";
import { getAuthNonce, verifyAuthSignature } from "../controllers/auth.controller";

const router = express.Router();

router.get("/nonce", getAuthNonce)
router.post("/verify", verifyAuthSignature);


export default router;