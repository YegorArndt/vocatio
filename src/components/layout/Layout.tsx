import { type PropsWithChildren } from "react";

import { Navigation } from "./Navigation";

type LayoutProps = PropsWithChildren<{
  className?: string;
}>;

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navigation />
      {children}
      <div role="spacer" className="h-20" />
    </>
  );
};
