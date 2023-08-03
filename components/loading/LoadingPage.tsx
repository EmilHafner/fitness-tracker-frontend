import { SpinnerIcon } from "@chakra-ui/icons";
import { AbsoluteCenter } from "@chakra-ui/react";
import { motion } from "framer-motion";





/**
 * Displays a loading spinner in the middle of the page
 */
export default function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <AbsoluteCenter>
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                    }}
                    className="flex items-center justify-center text-accent-muted"
                >
                    <SpinnerIcon className="" height={10} width={10} />
                </motion.div>
            </AbsoluteCenter>
        </div>
    );
}
