import { useRouter } from "next/router";
import cn from "classnames";

import { Link, type LinkProps } from "./ui/buttons/Link";

const { log } = console;

type NavigationLinkProps = {
  text?: string;
  to: string;
  activeCn?: string;
} & LinkProps;

export const NavigationLink = (props: NavigationLinkProps) => {
  const { to, className, activeCn = "", ...linkProps } = props;
  const { asPath } = useRouter();
  const isActive = asPath === to;

  return (
    <Link
      to={to}
      className={cn(className, {
        [activeCn]: isActive,
      })}
      {...linkProps}
    />
  );
};
