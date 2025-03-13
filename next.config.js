
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    headers: async () => {
        return [
            {
                source: "/api/obsidian/sync-notes",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "app://obsidian.md",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "POST, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    }
                ],
            },
        ];
    },
    images: {
        domains: ["i.ytimg.com"],
    },
};

export default config;
