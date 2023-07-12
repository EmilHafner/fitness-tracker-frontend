import {Box, Divider, Button} from "@chakra-ui/react";
import Link from "next/link";
import {useState} from "react";


export default function Navbar() {
    const [showLogin, setShowLogin] = useState(true)

    const itemList: ItemInterface[] = [
        {title: "Home", href: "/"},
        {title: "Trainings", href: "/trainings"},
        {title: "Plans", href: "/plans"},
        {title: "Login", href: "/auth/login"},
        {title: "Register", href: "/auth/register"}
    ]


    return (
        <div className={"pb-2"}>
            <Box className={"shadow-lg bg-neutral-50 w-full"}>
                <div className={"flex justify-between items-center py-4 px-16"}>
                    <div className={"flex gap-8 py-2 px-4"}>
                        {itemList.map((item, i) => <NavbarItem key={i} {...item} />)}
                    </div>
                    <div className={"flex py-2 px-4"}>
                        {showLogin ?
                            // Login Button
                            (
                                <Link href={"/auth/login"}>
                                    <Button
                                        className={"shadow-lg active:shadow-md hover:bg-sky-100 transition-[1s] py-2 px-8 rounded-2xl bg-sky-200 font-bold"}>
                                        Login
                                    </Button>
                                </Link>

                            )
                            :
                            (<></>)
                            // Profile Button
                        }
                    </div>

                </div>
                <Divider />
            </Box>

        </div>
    )
}

interface ItemInterface {
    title: string,
    href: string,
    dropdownItems?: ItemInterface[]
}

function NavbarItem(props: ItemInterface) {
    return (
        <Link href={props.href}>
            <Button className={"bg-slate-700 text-neutral-200 font-bold py-2 px-8 rounded shadow-lg active:shadow-md hover:bg-slate-600 hover:text-neutral-100 transition-[1s]"}>
                {props.title}
            </Button>
        </Link>

    )
}