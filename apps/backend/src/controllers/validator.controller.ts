import { application, type Request, type Response } from "express";
import { prisma } from "@repo/db";
import type { ApiResponse } from "@repo/types";

export async function getValidators(req: Request, res: Response) {
  try {
    const list = await prisma.validator.findMany();
    const sanitizedList = list.map((validator) => ({
      ...validator,
      activeStakeLamports: BigInt(validator.activeStakeLamports).toString(),
    }));
    const response: ApiResponse<typeof sanitizedList> = {
      success: true,
      data: sanitizedList,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log("Failed to get list", error);
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to get validators list",
    };
    res.status(500).json(response);
  }
}

export async function getValidatorById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validator = await prisma.validator.findUnique({
      where: {
        id,
      },
    });

    if (!validator) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validator not found",
      };
      return res.status(404).json(response);
    }
    const sanitizedValidator = {
      ...validator,
      activeStakeLamports: BigInt(validator.activeStakeLamports).toString(),
    };
    const response: ApiResponse<typeof sanitizedValidator> = {
      success: true,
      data: sanitizedValidator,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to get validator details",
    };
    console.log("Failed to get validator details", error);
    res.status(500).json(response);
  }
}
