import Image from "next/image";

export default async function Home() {
    return (
        <div className="flex flex-col h-full min-h-screen bg-black">
            <div className="flex flex-row justify-between px-64 py-6 border-b border-secondary/10">
                <div className="flex flex-row items-center">
                    <Image
                        src="/logo.png"
                        alt="Obsidian"
                        width={24}
                        height={24}
                    />
                    <p className="ml-2 text-lg font-bold">Notes AI</p>
                </div>
                <div className="flex flex-row items-center">
                    <a
                        className="px-8 py-2 text-secondary font-bold rounded-md"
                        href="/auth/login"
                    >
                        Login</a>
                    <a
                        className="ml-2 px-4 py-2 bg-accent font-bold rounded-md"
                        href="/auth/signup"
                    >
                        Get Started
                    </a>
                </div>
            </div>
            <div className="flex flex-col items-center pt-32">
                <h1 className="text-5xl font-bold mb-4">Obsidian Notes AI</h1>
                <p className="text-lg text-secondary font-medium mb-8">upload your markdown files and interact with your notes via a Large Language Model</p>
                <Image
                    className="rounded-md border-8 border-secondary"
                    src="/screenshots/example.png"
                    alt="Example"
                    width={800}
                    height={300}
                />
                <a
                    className="mt-8 px-8 py-3 bg-accent font-bold rounded-md"
                    href="/auth/signup"
                >
                    Get Started
                </a>
            </div>
        </div>
    );
}
