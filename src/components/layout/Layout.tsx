import { type ReactNode, type PropsWithChildren } from "react";
import cn from "classnames";

import { Navbar } from "./Navbar";

type LayoutProps = PropsWithChildren<{
  className?: string;
  toolbar?: ReactNode;
}>;

export const Layout = (props: LayoutProps) => {
  const { children, toolbar, className } = props;

  return (
    <div className={cn("app-container", className)}>
      <Navbar>{toolbar}</Navbar>
      <main className="main-container">{children}</main>
    </div>
  );
};
