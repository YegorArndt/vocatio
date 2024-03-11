import { type ReactNode, type PropsWithChildren } from "react";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { MenuButton, Menu } from "@szhsin/react-menu";
import { useRouter } from "next/router";
import { PiSignOutDuotone } from "react-icons/pi";
import { api } from "~/utils";
import { Divider } from "./Divider";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { NavigationLink } from "../NavigationLink";

const { log } = console;

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

export const Navbar = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const { user: clerkUser } = useUser();
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();

  const name = clerkUser?.firstName || user?.name;
  const veryTop = name ? `${name}'s` : "Your";

  return (
    <nav className="fixed inset-0 z-layout flex h-screen w-[220px] flex-col bg-secondary px-1 font-medium clr-secondary [&>*]:!justify-start [&>*]:gap-2 [&>*]:px-3 [&>*]:py-1">
      <Menu
        menuButton={
          <MenuButton className="flex-y gap-3 whitespace-nowrap !py-3 clr-primary">
            <Image src="/favicon.ico" alt="" height={15} width={15} />
            {veryTop} vocatio
          </MenuButton>
        }
        transition
        className="[&>*]:p-3"
        portal
      >
        <SignOutButton signOutCallback={() => router.push("/landing")}>
          <span className="flex-y cursor-pointer gap-2">
            <PiSignOutDuotone /> Sign out
          </span>
        </SignOutButton>
      </Menu>
      {[
        {
          text: "My vacancies",
          to: "/vacancies",
          frontIcon: <MdDashboardCustomize fontSize={18} />,
        },
        {
          text: "Settings",
          to: "/settings/me",
          frontIcon: <IoSettingsOutline fontSize={18} />,
          activeIfIncludes: ["updateKey", "settings"],
        },
      ].map((props) => (
        <NavigationLink
          key={props.text}
          {...props}
          baseCn="primary"
          activeCn="main-hover"
        />
      ))}
      <Divider />
      {children}
    </nav>
  );
};

export const Layout = (props: LayoutProps) => {
  const { children, toolbar } = props;

  return (
    <div className="grid grid-cols-[240px_1fr] gap-8 py-16">
      <Navbar>{toolbar}</Navbar>
      <div />
      {children}
    </div>
  );
};
