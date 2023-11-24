import { type ReactNode, type PropsWithChildren } from "react";

import { Aside } from "./Aside";

type LayoutProps = PropsWithChildren<{
  className?: string;
  asideChildren?: ReactNode;
}>;

export const Layout = (props: LayoutProps) => {
  const { children, asideChildren } = props;

  return (
    <>
      <div className="grid grid-cols-[240px_1fr] pb-[3rem]">
        <div />
        <Aside>{asideChildren}</Aside>
        {children}
      </div>
    </>
  );
};
