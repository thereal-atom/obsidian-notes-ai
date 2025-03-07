import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { newId } from "~/utils/id";

export const createVaultProcedure = protectedProcedure
    .input(z.object({
        name: z.string().min(1).max(128),
    }))
    .mutation(async ({
        ctx,
        input,
    }) => {
        const existingVault = await ctx.prisma.vaults.findFirst({
            where: {
                name: input.name,
            },
        });

        if (existingVault) {
            throw new Error(`vault with name [${input.name}] already exists`);
        };

        const vault = await ctx.prisma.vaults.create({
            data: {
                id: newId("vault"),
                name: input.name,
                userId: ctx.user.id,
            },
        });

        return vault;
    });

export const getAllVaultsProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const vaults = await ctx.prisma.vaults.findMany({
            where: {
                userId: ctx.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (vaults.length <= 0) {
            const newVault = await ctx.prisma.vaults.create({
                data: {
                    id: newId("vault"),
                    name: "New Vault",
                    userId: ctx.user.id,
                },
            });

            if (!newVault) {
                throw new Error("error creating new vault");
            }

            return [newVault];
        };

        return vaults;
    })