import { type ReactNode, type PropsWithChildren } from "react";
import cn from "classnames";

import { Navbar } from "./Navbar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/external/Popover";
import { Bell, Checkmark } from "../icons";
import { usePersistantData } from "~/hooks/usePersistantData";
import { Link } from "../ui/buttons/Link";

const { log } = console;

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

const Notifications = () => {
  const { ls } = usePersistantData();
  const { notifications } = ls;

  const hasNotifications = notifications.length > 0;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "fixed right-5 top-5 z-dropdown rounded-full border bg-primary p-2",
          {
            "after:absolute after:right-0 after:top-0 after:h-2 after:w-2 after:rounded-full after:bg-[#51A8FF]":
              hasNotifications,
          }
        )}
      >
        <Bell />
      </PopoverTrigger>
      <PopoverContent>
        {notifications.map((notification) => {
          const { title, type, body, link } = notification;
          return (
            <div
              key={title}
              className="flex-y [&>div+div]:border-top gap-3 pb-3"
            >
              <Checkmark fontSize={20} />
              <section>
                <h4 className="text-[1rem]">{title}</h4>
                {body && <span>{body}</span>}
                {link && (
                  <Link
                    text="Click here to view"
                    to={link}
                    className="clr-blue"
                  />
                )}
              </section>
            </div>
          );
        })}
        {!hasNotifications && (
          <div className="flex-center gap-2">No notifications</div>
        )}
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
