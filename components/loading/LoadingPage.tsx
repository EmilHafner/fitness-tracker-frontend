import { AbsoluteCenter } from "@chakra-ui/react";

/**
 * Displays a loading spinner in the middle of the page
 */
export default function LoadingPage() {
    return (
        <AbsoluteCenter>
            <span className="loading loading-spinner loading-lg text-stone-500"></span>
        </AbsoluteCenter>
    );
}
