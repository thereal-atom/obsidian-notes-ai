import { signup } from "../actions";

export default function LoginPage() {
    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <form className="flex flex-col">
                <h1 className="text-3xl font-bold mb-8">Signup</h1>
                <div className="flex flex-col">
                    <label
                        className="font-medium"
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
                        className="font-medium"
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

                <div className="flex flex-col mt-4">
                    <label
                        className="font-medium"
                        htmlFor="confirm-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="w-[400px] mt-1 p-3 border border-secondary/20 bg-transparent rounded-md"
                        placeholder="super secret password. *again*"
                        id="confirm password"
                        name="confirm password"
                        type="confirm password"
                        required
                    />
                </div>

                <div className="flex flex-col items-center mt-4">
                    <button
                        className="w-full py-3 bg-accent font-bold rounded-md"
                        formAction={signup}
                    >
                        Log in
                    </button>
                    <p className="mt-4 text-sm font-semibold">Already have an account? <a className="text-accent" href="/auth/login">Login</a></p>
                </div>
            </form>
        </div>
    )
}