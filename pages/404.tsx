import { AbsoluteCenter } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Custom404() {
    const router = useRouter();

    return (
        <AbsoluteCenter>
            <div className="hero min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">404</h1>
                        <p className="py-6">
                            Page not found.
                        </p>
                        <button className="btn btn-outline" onClick={() => router.push("/")}>Back to homepage</button>
                    </div>
                </div>
            </div>
        </AbsoluteCenter>
    );
}
