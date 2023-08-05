import { signIn, signOut } from "next-auth/react";

export function UserCard({ authPage, username }: { authPage: boolean; username?: string | null }) {
    if (authPage) return null;

    if (!username) {
        return (
            <div
                className={
                    "rounded-2xl bg-accent px-8 py-2 font-bold shadow-lg transition-[1s] hover:cursor-pointer hover:bg-accent-muted"
                }
                onClick={() => signIn()}
            >
                Login
            </div>
        );
    }

    return (
        <div className={"px-4 py-2 md:flex"}>
            <div className="flex items-center gap-4">
                <p className="text-xl font-bold text-accent">{username}</p>
                <div
                    className={
                        "rounded-2xl bg-accent px-8 py-2 font-bold shadow-lg transition-[1s] hover:cursor-pointer hover:bg-accent-muted"
                    }
                    onClick={() => signOut()}
                >
                    Logout
                </div>
            </div>
        </div>
    );
}
