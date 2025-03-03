import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        SUPABASE_URL: z.string().url(),
        SUPABASE_ANON_KEY: z.string(),
        SUPABASE_SERVICE_ROLE_KEY: z.string(),
        GEMINI_API_KEY: z.string(),
    },
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
