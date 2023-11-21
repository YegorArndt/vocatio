import type { PropsWithChildren, HTMLAttributes } from "react";
import cn from "classnames";

type HeaderProps = PropsWithChildren<HTMLAttributes<HTMLElement>>;

const HEADER_POSITION = "sticky left-0 top-0 z-50";
const HEADER_EFFECTS = "px-5 backdrop-blur-md border-bottom";

export const Header = (props: HeaderProps) => {
  const { children, className, ...rest } = props;

  return (
    <header
      {...rest}
      className={cn(HEADER_EFFECTS, className, HEADER_POSITION)}
    >
      {children}
    </header>
  );
};
