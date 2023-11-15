import { NavigationLink } from "../ui/buttons/NavigationLink";
import { Header } from "./Header";
import { UserPresentator } from "./UserPresentator";

type NavigationLinkProps = {
  text: string;
  to: string;
  pathname: string;
};

const navigationLinks = [
  { text: "My vacancies", to: "/vacancies" },
  { text: "Create", to: "/create" },
  { text: "Settings", to: "/settings/presets" },
];

const ACTIVE_BEFORE =
  "relative before:absolute before:h-0 before:w-[75%] before:left-[50%] before:right-[50%] before:transform before:-translate-x-1/2 before:bottom-[-0.5rem] before:border-b-2 !clr-base";

export const Navigation = () => {
  return (
    <Header className="flex flex-col gap-4">
      <UserPresentator />
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
    </Header>
  );
};
