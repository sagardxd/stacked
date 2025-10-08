import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@repo/config";
import type { ApiResponse } from "@repo/types";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    walletPubkey: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
      } as ApiResponse<null>);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: number;
      walletPubkey: string;
      iat: number;
      exp: number;
    };

    if(!decoded){
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        } as ApiResponse<null>);
    }
    
    req.user = {
      id: decoded.id,
      walletPubkey: decoded.walletPubkey,
    };

    next();
  } catch (err: any) {
    console.error("JWT verification error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    } as ApiResponse<null>);
  }
}
