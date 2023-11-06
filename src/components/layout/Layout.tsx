import { type PropsWithChildren } from "react";

import { Navigation } from "./Navigation";
import { Link } from "~/components/ui/buttons/Link";

type LayoutProps = PropsWithChildren<{
  className?: string;
}>;

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navigation />
      {children}
      <footer className="flex-center border-top mt-[80px] h-[80px] w-full gap-2">
        Learn about our
        <Link
          text="Privacy Policy"
          to="/privacy-policy"
          className="underline clr-blue"
        />
      </footer>
    </>
  );
};
