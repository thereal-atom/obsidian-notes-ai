import { createTRPCRouter } from "../../trpc";
import { createVaultProcedure, getAllVaultsProcedure } from "./procedures";

export const vaultsRouter = createTRPCRouter({
    create: createVaultProcedure,
    getAll: getAllVaultsProcedure,
})