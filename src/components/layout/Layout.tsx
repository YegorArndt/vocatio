import { type ReactNode, type PropsWithChildren } from "react";
import cn from "classnames";

import { Navbar } from "./Navbar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { Bell } from "../icons";

const { log } = console;

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

const Notifications = () => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "fixed right-5 top-5 z-dropdown rounded-full border bg-primary p-2",
          {
            "after:absolute after:right-0 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-[#51A8FF]":
              false,
          }
        )}
      >
        <Bell />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex-center gap-2">No notifications</div>
      </PopoverContent>
    </Popover>
  );
};

export const Layout = (props: LayoutProps) => {
  const { children, toolbar, className } = props;

  return (
    <>
      <Notifications />
      <div className={cn("app-container", className)}>
        <Navbar>{toolbar}</Navbar>
        <main className="main-container">{children}</main>
      </div>
    </>
  );
};
