import { type ReactNode, type PropsWithChildren } from "react";
import cn from "classnames";

import { Navbar } from "./Navbar";
import { DarkThemeSwitch, LightThemeSwitch } from "../icons";
import { TooltipTrigger } from "~/components/ui/external/Tooltip";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { useSettings } from "~/hooks/useSettings";

const { log } = console;

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

const ThemeSwitcher = () => {
  const { settings, updateSettings } = useSettings();

  const handler = () => {
    const theme = settings.theme === "dark" ? "light" : "dark";
    updateSettings({ theme });
    eventManager.emit(Events.THEME_UPDATED, { theme });
  };

  return (
    <TooltipTrigger
      className="rounded-full border bg-primary p-2"
      onClick={handler}
    >
      {settings.theme === "dark" ? (
        <DarkThemeSwitch fontSize={17} />
      ) : (
        <LightThemeSwitch fontSize={17} />
      )}
    </TooltipTrigger>
  );
};

export const Layout = (props: LayoutProps) => {
  const { children, toolbar, className } = props;

  return (
    <>
      {/* <header className="flex-center fixed right-5 top-5 z-dropdown gap-2">
        <TooltipProvider>
          <Tooltip>
            <ThemeSwitcher />
            <TooltipContent>Change theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header> */}
      <div className={cn("app-container", className)}>
        <Navbar>{toolbar}</Navbar>
        <main className="main-container">{children}</main>
      </div>
    </>
  );
};
