import { twMerge } from "tailwind-merge";

type ButtonProps = {
  className?: string;
  children: React.ReactNode,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  return (
    <button {...props}
    className={twMerge(
        "px-4 py-2 rounded-xl shadow-xl bg-accent hover:bg-accent-muted",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
