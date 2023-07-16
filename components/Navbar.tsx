import { Box, Divider, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(true);

  const itemList: ItemInterface[] = [
    { title: "Trainings", href: "/trainings" },
    { title: "Plans", href: "/plans" },
  ];

  return (
    <div className={""}>
      <Box
        className={
          "flex flex-wrap items-center justify-between shadow-xl bg-primary w-full py-4 px-16"
        }
      >
        <Link href={"/"} className={"w-32"}>
          <Image
            src={"/logo/logo-no-background.svg"}
            width={120}
            height={30}
            alt={"Logo"}
          />
        </Link>
        <div className={"flex gap-8 py-2 px-4"}>
          {itemList.map((item, i) => (
            <NavbarItem key={i} {...item} />
          ))}
        </div>
        <div className={"flex py-2 px-4"}>
          {
            showLogin ? (
              // Login Button
              <Link href={"/auth/login"}>
                <Button
                  className={
                    "shadow-lg hover:bg-accent-muted transition-[1s] py-2 px-8 rounded-2xl bg-accent font-bold"
                  }
                >
                  Login
                </Button>
              </Link>
            ) : (
              <></>
            )

            // Profile Button
          }
        </div>

        <Divider />
      </Box>
    </div>
  );
}

interface ItemInterface {
  title: string;
  href: string;
  dropdownItems?: ItemInterface[];
}

function NavbarItem(props: ItemInterface) {
  return (
    <Link
      href={props.href}
      className={
        "font-bold text-lg text-accent py-2 hover:text-accent-muted transition-[1s]"
      }
    >
      {props.title}
    </Link>
  );
}
