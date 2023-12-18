import { type PropsWithChildren } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FaLaptopCode } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

import { NavigationLink } from "../NavigationLink";
import { Divider } from "./Divider";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { api } from "~/utils";
import { useRouter } from "next/router";

const mainNav = [
  { text: "My vacancies", to: "/vacancies", frontIcon: <FaLaptopCode /> },
  { text: "Create CV", to: "/create", frontIcon: <IoNewspaperOutline /> },
  {
    text: "Preferences",
    to: "/preferences/my-data",
    frontIcon: <IoSettingsOutline />,
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover flex-y gap-1"
    activeCn="bg-hover"
    {...props}
  />
));

export const Navbar = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const { user: clerkUser, isLoaded } = useUser();
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const router = useRouter();

  const name = clerkUser?.firstName || user?.name;
  const veryTop = name ? `${name}'s` : "Your";

  return (
    <nav className="navbar border-right fixed inset-0 z-layout flex w-[240px] flex-col bg-secondary font-semibold clr-secondary [&>*]:px-4 [&>*]:py-1">
      <Menu
        menuButton={
          <MenuButton className="flex !py-3">
            🐈 &nbsp;&nbsp; {veryTop} vocatio
          </MenuButton>
        }
        transition
        className="[&>*]:p-3"
        direction="right"
      >
        <SignOutButton
          signOutCallback={() =>
            router.push(
              "https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin"
            )
          }
        >
          Sign out
        </SignOutButton>
      </Menu>
      {mainNav}
      <Divider />
      {children}
      {/* <footer className="mx-auto mb-5 mt-auto">
        <BlurImage
          src="https://camo.githubusercontent.com/28aae05a0fba45679e8e27d90609601e249b64a5fe30dfef05495de4f4e318d4/68747470733a2f2f63646e2e6275796d6561636f666665652e636f6d2f627574746f6e732f76322f64656661756c742d79656c6c6f772e706e67"
          height={150}
          width={150}
          alt="Buy me a coffee"
        />
      </footer> */}
    </nav>
  );
};
