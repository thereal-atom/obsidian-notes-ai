import { signout } from "./actions";
import { createClient } from "~/utils/supabase/server";

export default async function AccountPage() {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.getUser();

    if (error) {
        console.error(error);

        return <p>there was an error</p>;
    };

    const user = data.user;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <form>
                <button
                    className="mt-4 px-16 py-4 bg-yellow-800 font-bold rounded-md hover:cursor-pointer disabled:opacity-50"
                    formAction={signout}
                >
                    Signout
                </button>
            </form>
        </div>
    )
}