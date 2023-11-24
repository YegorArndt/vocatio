import { useUser } from "@clerk/nextjs";
import { api } from "~/utils";
import { FaLaptopCode } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { NavigationLink } from "../ui/buttons/NavigationLink";
import { PropsWithChildren } from "react";

const mainNav = [
  { text: "My vacancies", to: "/vacancies", frontIcon: <FaLaptopCode /> },
  { text: "Create CV", to: "/create", frontIcon: <IoNewspaperOutline /> },
  { text: "Preferences", to: "/preferences", frontIcon: <IoSettingsOutline /> },
];

const Divider = () => <div className="my-2 h-[0.5px] w-full bg-border !p-0" />;

export const Aside = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();

  const firstName = defaultUserData.user?.firstName;

  return (
    <aside className="border-right fixed inset-0 z-50 flex w-[240px] flex-col bg-secondary font-semibold clr-secondary [&>*]:px-4 [&>*]:py-1">
      <header className="!py-3">
        🐈 &nbsp;&nbsp;{firstName}&quot;s vocatio
      </header>
      {mainNav.map((props) => (
        <NavigationLink
          key={props.text}
          baseCn="common hover flex-center-y gap-1"
          activeCn="bg-hover"
          {...props}
        />
      ))}
      <Divider />
      {children}
    </aside>
  );
};
