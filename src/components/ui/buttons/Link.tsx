import NextLink from "next/link";
import { forwardRef, ReactNode, type PropsWithChildren, type Ref } from "react";
import cn from "classnames";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = PropsWithChildren<
  {
    to: NextLinkProps["href"];
    frontIcon?: ReactNode;
    newTab?: boolean;
    text?: string;
    baseCn?: string;
    className?: string;
  } & Omit<NextLinkProps, "href">
>;

export const Link = forwardRef(
  (props: LinkProps, ref: Ref<HTMLAnchorElement>) => {
    const {
      to,
      frontIcon,
      newTab,
      text,
      children = text,
      baseCn,
      className,
      ...rest
    } = props;

    const shouldNewTab = newTab ? { target: "_blank", rel: "noreferrer" } : {};

    return (
      <NextLink
        className={cn(className, baseCn)}
        href={to}
        aria-label={text}
        ref={ref}
        replace
        {...rest}
        {...shouldNewTab}
      >
        {frontIcon && <span className="mr-2">{frontIcon}</span>}
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";
