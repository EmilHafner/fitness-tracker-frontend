import { SpinnerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
    className?: string;
    variant?: "normal" | "big";
    isLoading?: boolean;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
    const { className, variant, isLoading, children, disabled, ...rest } = props;

    let sizeClasses = "px-2 py-2 ";
    if (props.variant === "big") {
        sizeClasses = "px-6 py-4 ";
    }

    return (
        <button
            {...rest}
            className={twMerge(
                sizeClasses +
                    (disabled && "cursor-not-allowed opacity-50") +
                    "relative rounded-xl bg-accent font-medium shadow-xl hover:bg-accent-muted",
                className
            )}
        >
            <div className={(!isLoading && "opacity-0 ") + "absolute flex h-full w-full items-center justify-center"}>
                <SpinnerIcon className="absolute animate-spin"></SpinnerIcon>
            </div>

            <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
        </button>
    );
}
