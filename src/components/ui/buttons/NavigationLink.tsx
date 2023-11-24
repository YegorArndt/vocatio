import { useRouter } from "next/router";
import cn from "classnames";

import { Link, type LinkProps } from "./Link";

type NavigationLinkProps = {
  text: string;
  to: string;
  activeCn?: string;
} & LinkProps;

export const NavigationLink = (props: NavigationLinkProps) => {
  const { to, className, activeCn = "", ...linkProps } = props;
  const router = useRouter();
  const { pathname } = router;
  const isActive = pathname.includes(to);

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
