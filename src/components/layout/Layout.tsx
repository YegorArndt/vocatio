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
      <div className="absolute left-0 top-[65px] w-full" />
      {children}
      <footer className="mt-[5rem] flex w-screen grow items-end justify-center">
        <div className="border-top flex-center w-full gap-2 py-5">
          Learn about our
          <Link
            text="Privacy Policy"
            to="/privacy-policy"
            className="underline clr-blue"
          />
        </div>
      </footer>
    </>
  );
};
