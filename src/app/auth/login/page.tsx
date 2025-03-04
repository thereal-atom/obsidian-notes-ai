import { login, signup } from "./actions";

export default function LoginPage() {
    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <form className="flex flex-col">
                <div className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="w-[400px] mt-1 p-3 border border-secondary/20 bg-transparent rounded-md"
                        placeholder="petemitchel@gmail.com"
                        id="email"
                        name="email"
                        type="email"
                        required
                    />
                </div>

                <div className="flex flex-col mt-4">
                    <label
                        className="font-semibold"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="w-[400px] mt-1 p-3 border border-secondary/20 bg-transparent rounded-md"
                        placeholder="super secret password"
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                </div>

                <div className="flex flex-row mt-8">
                    <button
                        className="w-full py-3 bg-accent font-bold rounded-md"
                        formAction={login}
                    >
                        Log in
                    </button>
                    <button
                        className="w-full py-3 ml-4 bg-accent font-bold rounded-md"
                        formAction={signup}
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}