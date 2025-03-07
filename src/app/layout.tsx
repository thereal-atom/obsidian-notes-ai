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
    const isDevelopment = process.env.NODE_ENV === "development";

    return (
        <html lang="en" className={`${GeistSans.variable} bg-[#15131C] text-white`}>
            <body>
                {isDevelopment ? (
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                ) : (
                    <div className="flex items-center justify-center h-screen w-screen">
                        <p className="text-3xl font-bold text-accent">Under Construction</p>
                    </div>
                )}
            </body>
        </html>
    );
}