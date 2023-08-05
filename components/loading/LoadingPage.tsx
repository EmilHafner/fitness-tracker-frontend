import { SpinnerIcon } from "@chakra-ui/icons";
import { AbsoluteCenter } from "@chakra-ui/react";

/**
 * Displays a loading spinner in the middle of the page
 */
export default function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <AbsoluteCenter>
                <div className="text-accent">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </AbsoluteCenter>
        </div>
    );
}
