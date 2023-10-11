import { type PropsWithChildren } from "react";

import { Navigation } from "./Navigation";

type LayoutProps = {
  className?: string;
};

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const { children } = props;

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};
