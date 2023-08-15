import { twJoin, twMerge } from "tailwind-merge";

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

    // --- Old styling ---
    // className={twMerge(
    //     twJoin(sizeClasses, (disabled && "cursor-not-allowed opacity-50 "),
    //         " relative flex items-center justify-center rounded-xl bg-accent font-medium shadow-xl hover:bg-accent-muted"),
    //     className
    // )}


    return (
        <button
            {...rest}
            className={twMerge(
                twJoin(sizeClasses, (disabled && "cursor-not-allowed opacity-50 "),
                    " relative flex items-center justify-center rounded-xl bg-stone-100 border-2 border-stone-400 font-medium hover:border-accent shadow-md"),
                className
            )}
        >
            {/* TODO: Change this, so that the spinner is not always animated (with opacity-0) */}
            <div className={(!isLoading && "opacity-0 ") + " absolute flex items-center justify-center"}>
                <span className="loading loading-spinner loading-sm"></span>
                {/* <SpinnerIcon className="animate-spin"></SpinnerIcon> */}
            </div>

            <span className={"" + (isLoading && "opacity-0")}>{children}</span>
        </button>
    );
}
