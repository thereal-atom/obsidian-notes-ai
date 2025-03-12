import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        GEMINI_API_KEY: z.string(),
        YTTRANSCRIPT_API_KEY: z.string(),
    },
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        YTTRANSCRIPT_API_KEY: process.env.YTTRANSCRIPT_API_KEY,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
