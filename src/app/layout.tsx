import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
    title: "Obsidian Notes AI",
    description: "Interact with your notes using AI",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable} bg-[#15131C] text-white`}>
            <body>
                <TRPCReactProvider>{children}</TRPCReactProvider>
            </body>
        </html>
    );
}
