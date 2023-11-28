import { type PropsWithChildren } from "react";
import { useUser } from "@clerk/nextjs";
import { FaLaptopCode } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

import { api } from "~/utils";
import { NavigationLink } from "../NavigationLink";
import { Divider } from "./Divider";

const mainNav = [
  { text: "My vacancies", to: "/vacancies", frontIcon: <FaLaptopCode /> },
  { text: "Create CV", to: "/create", frontIcon: <IoNewspaperOutline /> },
  {
    text: "Preferences",
    to: "/preferences/me",
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
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();

  const firstName = defaultUserData.user?.firstName;

  return (
    <nav className="navbar border-right fixed inset-0 z-layout flex w-[240px] flex-col bg-secondary font-semibold clr-secondary [&>*]:px-4 [&>*]:py-1">
      <header className="!py-3">
        🐈 &nbsp;&nbsp;{firstName}&apos;s vocatio
      </header>
      {mainNav}
      <Divider />
      {children}
    </nav>
  );
};
