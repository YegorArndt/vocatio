import cn from "classnames";
import { Layout } from "~/components/layout/Layout";
import { NavigationLink } from "~/components/ui/buttons/NavigationLink";
import { baseSpacing } from "~/components/ui/buttons/constants";

/**
 * Break it down by sections:
 * 1. Configure default sections (maybe accordions? with "+" to add fields?)
 * 2. Default CV
 * 3. Default Cover Letter
 * 4. Fields from User Schema
 */

const navigationLinks = [
  {
    to: "/settings/presets",
    text: "Presets",
  },
  {
    to: "/settings/vacancy",
    text: "Vacancy",
  },
  {
    to: "/settings/appearance",
    text: "Appearance",
  },
];

const SettingsNavigation = () => {
  return (
    <ul className="flex flex-col">
      {navigationLinks.map((link) => (
        <li key={link.to}>
          <NavigationLink
            key={link.to}
            className="block"
            activeCn="!clr-base"
            {...link}
          />
        </li>
      ))}
    </ul>
  );
};

const Presets = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <div className="border-bottom p-10">
          <h2 className={cn("container font-normal", baseSpacing)}>Presets</h2>
        </div>
        <main className="container grid grid-cols-[1fr_3fr]">
          <SettingsNavigation />
        </main>
      </div>
    </Layout>
  );
};

export default Presets;
