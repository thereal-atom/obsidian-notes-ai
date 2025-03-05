import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { newId } from "~/utils/id";


export const vaultsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1).max(128),
        }))
        .mutation(async ({
            ctx,
            input,
        }) => {
            const {
                data: existingVault,
                error: existingVaultError,
            } = await ctx.db
                .from("vaults")
                .select("*")
                .eq("name", input.name)
                .maybeSingle();

            if (existingVaultError) {
                throw new Error("error fetching existing vault");
            };

            if (existingVault) {
                throw new Error(`vault with name [${input.name}] already exists`);
            };

            const {
                data: vault,
                error,
            } = await ctx.db
                .from("vaults")
                .insert({
                    id: newId("vault"),
                    name: input.name,
                    userId: ctx.user.id,
                })
                .select("*")
                .maybeSingle();

            if (error) {
                throw new Error("error creating vault");
            };

            if (!vault) {
                throw new Error("error creating vault");
            };

            return vault;
        }),
    getAll: protectedProcedure
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
        }),
})