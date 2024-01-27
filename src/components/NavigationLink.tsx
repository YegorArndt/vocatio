import { useRouter } from "next/router";
import cn from "classnames";

import { Link, type LinkProps } from "./ui/buttons/Link";

const { log } = console;

export type NavigationLinkProps = {
  text?: string;
  to: string;
  activeCn?: string;
  activeIfIncludes?: string[];
} & LinkProps;

export const NavigationLink = (props: NavigationLinkProps) => {
  const {
    to,
    className,
    activeCn = "",
    activeIfIncludes,
    ...linkProps
  } = props;
  const { asPath, pathname } = useRouter();
  let isActive = asPath === to;

  if (activeIfIncludes) {
    isActive =
      asPath === to || activeIfIncludes.some((path) => asPath.includes(path));
  }

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
