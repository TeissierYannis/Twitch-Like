// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> };

const createPrismaClient = () => {
    return new PrismaClient().$extends(withAccelerate());
};

export const db =
    globalForPrisma.prisma ??
    createPrismaClient();

// Ensure the Prisma Client is a singleton in development

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
