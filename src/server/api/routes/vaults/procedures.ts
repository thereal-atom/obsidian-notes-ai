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
        const {
            data: vaults,
            error,
        } = await ctx.db
            .from("vaults")
            .select("*")
            .eq("userId", ctx.user.id);

        if (error) {
            console.error(error);

            throw new Error("error fetching all vaults");
        };

        if (vaults.length <= 0) {
            const {
                data: newVault,
                error: newVaultError,
            } = await ctx.db
                .from("vaults")
                .insert({
                    id: newId("vault"),
                    name: "New Vault",
                    userId: ctx.user.id,
                })
                .select("*")
                .maybeSingle();

            if (newVaultError) {
                console.error(newVaultError);

                throw new Error("error creating new vault");
            };

            if (!newVault) {
                throw new Error("error creating new vault");
            }

            return { vaults: [newVault] };
        };

        return vaults;
    })