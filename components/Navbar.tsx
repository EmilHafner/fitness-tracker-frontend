import { Box } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

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
          {session?.user ? (
            <div className="flex gap-4 items-center">
              <p className="text-accent font-bold text-xl">
                {session?.user?.username}
              </p>
              <div
                className={
                  "shadow-lg hover:bg-accent-muted hover:cursor-pointer transition-[1s] py-2 px-8 rounded-2xl bg-accent font-bold"
                }
                onClick={() => signOut()}
              >
                Logout
              </div>
            </div>
          ) : (
              <div
                  className={
                      "shadow-lg hover:bg-accent-muted hover:cursor-pointer transition-[1s] py-2 px-8 rounded-2xl bg-accent font-bold"
                  }
                  onClick={() => signIn()}
              >
                  Login
              </div>
          )}
        </div>
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
