import { ItemInterface } from "global-types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";




export function NavbarItem(props: ItemInterface) {
    return (
        <Link
            href={props.href}
            className={twMerge(
                "py-2 text-lg font-bold text-accent transition-[1s] hover:text-accent-muted",
                props.className
            )}
        >
            {props.title}
        </Link>
    );
}