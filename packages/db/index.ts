import { PrismaClient } from "./generated/prisma";

export type * from "./generated/prisma";
export const prisma = new PrismaClient();