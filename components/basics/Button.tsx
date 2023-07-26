import { SpinnerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string,
  variant?: "normal" | "big",
  isLoading?: boolean,
  children: React.ReactNode,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { className, variant, isLoading, children, ...rest } = props;

  let sizeClasses = "px-2 py-2 ";
  if (props.variant === "big") {
    sizeClasses = "px-6 py-4 "
  }

  return (
    <button {...rest}
    className={twMerge(sizeClasses + (rest.disabled && "opacity-50 cursor-not-allowed") +
        " rounded-xl shadow-xl bg-accent hover:bg-accent-muted font-medium relative",
        className
      )}
    >

      {isLoading && (<div className={"absolute w-full h-full flex justify-center items-center left-0 top-0"}>
        <SpinnerIcon className="animate-spin h-5 w-5"></SpinnerIcon>
      </div>)}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
    </button>
  );
}
