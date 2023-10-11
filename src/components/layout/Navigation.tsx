import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils";
import cn from "classnames";
import { NavigationLink } from "../ui/buttons/NavigationLink";
import { Logo } from "../Logo";

type NavigationLinkProps = {
  text: string;
  to: string;
  pathname: string;
};

type UserPresentatorProps = {
  src: string;
  name: string;
};

const navigationLinks = [
  { text: "My vacancies", to: "/vacancies" },
  { text: "Create", to: "/create" },
  { text: "Settings", to: "/settings/presets" },
];

const ACTIVE_BEFORE =
  "relative before:absolute before:h-0 before:w-[75%] before:left-[50%] before:right-[50%] before:transform before:-translate-x-1/2 before:bottom-[-0.5rem] before:border-b-2 !clr-base";

const HEADER_POSITION = "sticky left-0 top-0 z-50";

const HEADER_COLORS = "px-5 backdrop-blur-md clr-base border-bottom";

const HEADER_DISPLAY = "flex flex-col items-start justify-between gap-2";

const UserPresentator = (props: UserPresentatorProps) => {
  const { src, name } = props;

  return (
    <div className="flex w-full items-center justify-normal gap-4 pl-3 pt-5">
      <Logo />
      <div className="h-[30px] w-[0.5px] rotate-[30deg] transform bg-base-reversed" />
      {src && (
        <Image
          src={src}
          height={25}
          width={25}
          className="rounded-full"
          alt={name || "Welcome!"}
        />
      )}
      <span>{name || "Loading..."}</span>
    </div>
  );
};

export const Navigation = () => {
  const defaultUserData = useUser();
  const { data: user } = api.users.get.useQuery();

  return (
    <header className={cn(HEADER_POSITION, HEADER_COLORS, HEADER_DISPLAY)}>
      <UserPresentator
        src={user?.ownImage || defaultUserData.user?.imageUrl}
        name={user?.ownName || defaultUserData.user?.fullName || "Welcome!"}
      />
      <nav className="pb-2">
        <div className="flex gap-3">
          {navigationLinks.map(({ text, to }, i) => (
            <NavigationLink
              key={text}
              text={text}
              to={to}
              activeCn={ACTIVE_BEFORE}
            />
          ))}
        </div>
      </nav>
    </header>
  );
};
