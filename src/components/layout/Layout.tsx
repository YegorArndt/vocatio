import { type ReactNode, type PropsWithChildren } from "react";
import cn from "classnames";

import { Navbar } from "./Navbar";
import { DarkThemeSwitch, LightThemeSwitch } from "../icons";
import {
  TooltipProvider,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { useTheme } from "~/hooks/useTheme";

const { log } = console;

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

const ThemeSwitcher = () => {
  const [theme, setTheme] = useTheme();

  return (
    <TooltipTrigger
      className="rounded-full border bg-primary p-2"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" ? (
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
      <header className="flex-center fixed right-5 top-5 z-dropdown gap-2">
        <TooltipProvider>
          <Tooltip>
            <ThemeSwitcher />
            <TooltipContent>Change theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <div className={cn("app-container", className)}>
        <Navbar>{toolbar}</Navbar>
        <main className="main-container">{children}</main>
      </div>
    </>
  );
};
