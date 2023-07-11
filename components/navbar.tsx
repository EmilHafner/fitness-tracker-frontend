import {Box, Flex, Button} from "@chakra-ui/react";
import Link from "next/link";


export default function Navbar() {

    const itemList: ItemInterface[] = [
        {title: "Home", href: "/"},
        {title: "Trainings", href: "/trainings"},
        {title: "Plans", href: "/plans"}
    ]


    return (
        <div>
            <Box>
                <Flex>
                    {itemList.map((item, i) => <NavbarItem key={i} {...item} />)}
                </Flex>
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
            <Button className={"p-2"} >
                {props.title}
            </Button>
        </Link>

    )
}