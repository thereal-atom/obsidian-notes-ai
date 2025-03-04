import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
            },
            colors: {
                primary: "#15131C",
                secondary: "#C3C3FF",
                accent: "#635BFF"
            }
        },
    },
    plugins: [],
} satisfies Config;
