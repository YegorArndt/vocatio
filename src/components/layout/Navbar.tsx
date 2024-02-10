import { type PropsWithChildren } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";

import { Divider } from "./Divider";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { api } from "~/utils";
import { useRouter } from "next/router";
import { PiSignOutDuotone } from "react-icons/pi";
import { mainNav } from "./constants";

export const Navbar = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const { user: clerkUser } = useUser();
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();

  const name = clerkUser?.firstName || user?.name;
  const veryTop = name ? `${name}'s` : "Your";

  return (
    <nav className="navbar border-right fixed inset-0 z-layout flex w-[240px] flex-col bg-secondary font-semibold clr-secondary [&>*]:px-4 [&>*]:py-1">
      <Menu
        menuButton={
          <MenuButton className="flex whitespace-nowrap !py-3 font-semibold clr-primary">
            🐈 &nbsp;&nbsp; {veryTop} vocatio
          </MenuButton>
        }
        transition
        className="[&>*]:p-3"
      >
        <SignOutButton signOutCallback={() => router.push("/landing")}>
          <span className="flex-y cursor-pointer gap-2">
            <PiSignOutDuotone /> Sign out
          </span>
        </SignOutButton>
      </Menu>
      {mainNav}
      <Divider />
      {children}
      <footer className="flex-center mx-auto mb-5 mt-auto flex-col gap-2">
        {/* <Link to="https://www.buymeacoffee.com/daytora" newTab>
          <BlurImage
            src="https://camo.githubusercontent.com/28aae05a0fba45679e8e27d90609601e249b64a5fe30dfef05495de4f4e318d4/68747470733a2f2f63646e2e6275796d6561636f666665652e636f6d2f627574746f6e732f76322f64656661756c742d79656c6c6f772e706e67"
            height={150}
            width={150}
            alt="Buy me a coffee"
          />
        </Link> */}
        <small>Vocatio Beta, v. 0.1</small>
      </footer>
    </nav>
  );
};
