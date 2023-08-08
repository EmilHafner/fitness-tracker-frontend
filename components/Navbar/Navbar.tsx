import { Box } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { UserCard } from "./UserCard";
import { NavbarItem } from "./NavbarItem";
import { itemList } from "@/data/variables";

export default function Navbar() {
    const { data: session } = useSession();
    const [authPage, setAuthPage] = useState(false);
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
        if (router.asPath.startsWith("/auth")) {
            setAuthPage(true);
        } else {
            setAuthPage(false);
        }
    }, [router.asPath]);

    return (
        <div className={"relative z-50 mb-6 border-b-2 bg-stone-200"}>
            <Box className={"z-50 flex w-full flex-wrap items-center justify-between bg-stone-100 px-12 py-4 md:px-16"}>
                {/* Logo */}
                <Link href={"/"} className={"w-32"}>
                    <Image src={"/logo/logo-no-background.svg"} width={120} height={30} alt={"Logo"} />
                </Link>

                {/* Navbar Items */}
                <div className={"hidden gap-8 px-4 py-2 md:flex"}>
                    {itemList.map((item, i) => (
                        <NavbarItem key={i} {...item} />
                    ))}
                </div>

                <div className="hidden md:inline">
                    <UserCard authPage={authPage} username={session?.user?.username} />
                </div>

                {/* Hamburger Menu */}
                <button className="flex py-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="flex h-8 w-8 items-center justify-center">
                        {menuOpen ? (
                            <CloseIcon width={"max"} height={"max"} p={1} color={"black"} />
                        ) : (
                            <HamburgerIcon width={"max"} height={"max"} color={"black"} />
                        )}
                    </div>
                </button>
            </Box>

            {/* Menu on smaller screens */}
            {menuOpen && (
                <div className="absolute z-10 flex w-screen flex-col items-center border-b-2 bg-stone-100 pb-8 ">
                    <UserCard authPage={authPage} username={session?.user?.username} />
                    {itemList.map((item, i) => (
                        <NavbarItem key={i} {...item} className="py-6 text-3xl" />
                    ))}
                </div>
            )}
        </div>
    );
}
