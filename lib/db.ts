// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({

    }).$extends(withAccelerate());

// Ensure the Prisma Client is a singleton in development

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
