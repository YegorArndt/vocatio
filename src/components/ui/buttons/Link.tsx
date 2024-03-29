import NextLink from "next/link";
import { forwardRef, ReactNode, type PropsWithChildren, type Ref } from "react";
import cn from "classnames";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = PropsWithChildren<
  {
    to: NextLinkProps["href"] | undefined | null;
    frontIcon?: ReactNode;
    newTab?: boolean;
    text?: string;
    baseCn?: string;
    className?: string;
    id?: string;
    endIcon?: ReactNode;
    disabled?: boolean;
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
      endIcon,
      ...rest
    } = props;

    const shouldNewTab = newTab ? { target: "_blank", rel: "noreferrer" } : {};

    return (
      to && (
        <NextLink
          className={cn(className, baseCn)}
          href={to}
          aria-label={text}
          ref={ref}
          replace
          {...rest}
          {...shouldNewTab}
        >
          {frontIcon && <span className="mr-[0.3em]">{frontIcon}</span>}
          {children}
          {endIcon && <span className="ml-1">{endIcon}</span>}
        </NextLink>
      )
    );
  }
);

Link.displayName = "Link";
