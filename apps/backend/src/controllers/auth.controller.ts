import type { Request, Response } from "express";
import { prisma } from "@repo/db";
import { config } from "@repo/config";
import type { ApiResponse } from "@repo/types";
import { buildAuthMessage, makeNonce } from "../utils/auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import jwt from "jsonwebtoken";

export async function getAuthNonce(req: Request, res: Response) {
  try {
    const { walletPubkey } = req.query;
    console.log('sendingnonce for', walletPubkey);

    if (typeof walletPubkey !== "string" || !walletPubkey) {
      return res.status(400).json({
        success: false,
        message: "Invalid walletPubkey",
      });
    }

    const nonce = makeNonce();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await prisma.nonce.create({
      data: {
        walletPubkey,
        nonce,
        expiresAt,
      },
    });

    const message = buildAuthMessage({
      domain: req.headers.host || "localhost",
      walletPubkey,
      uri: `${config.APP_URI}`,
      nonce,
      issuedAtISO: new Date().toISOString(),
      expiryISO: expiresAt.toISOString(),
    });


    res.status(200).json({
      success: true,
      data: message,
    } as ApiResponse<string>);
  } catch (error) {
    console.error("Error generating nonce:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse<null>);
  }
}

export async function verifyAuthSignature(req: Request, res: Response) {
  try {
    const { walletPubkey, signature, message } = req.body;
    if (!walletPubkey || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: "Invalid walletPubkey or signature",
      } as ApiResponse<null>);
    }

    console.log("Verifying signature for wallet:", walletPubkey);

    const nonceRecord = await prisma.nonce.findFirst({
      where: {
        walletPubkey,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!nonceRecord) {
      return res.status(400).json({
        success: false,
        message: "No valid nonce found for this wallet",
      } as ApiResponse<null>);
    }

    const sigBytes = bs58.decode(signature);
    const msgBytes = new TextEncoder().encode(message);
    const pubKeyBytes = bs58.decode(walletPubkey);

    const verify = nacl.sign.detached.verify(msgBytes, sigBytes, pubKeyBytes);
    if (!verify) {
      return res.status(400).json({
        success: false,
        message: "Signature verification failed",
      } as ApiResponse<null>);
    }

    await prisma.nonce.delete({
      where: {
        id: nonceRecord.id,
      },
    });
    let user = await prisma.user.findUnique({
      where: {
        walletPubkey,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletPubkey,
        },
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        walletPubkey: user.walletPubkey,
      },
      config.JWT_SECRET,
      { expiresIn: "30d" }
    );
    const userWithToken = { ...user, token };

    console.log('/.///////////////////////');
    console.log(userWithToken);

    res.status(200).json({
      success: true,
      data: userWithToken,
    } as ApiResponse<typeof userWithToken>);
  } catch (error) {
    console.error("Error verifying signature:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse<null>);
  }
}
