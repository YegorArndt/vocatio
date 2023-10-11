import NextLink from "next/link";
import { memo, forwardRef } from "react";
import cn from "classnames";
import type { LinkProps as NextLinkProps } from "next/link";
import type { Ref } from "react";
import { DefaultButtonProps } from "./BaseButton";
import { tertiary } from "./constants";

export type LinkProps = {
  to: NextLinkProps["href"];
  newTab?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "tertiary";
} & Omit<NextLinkProps, "href"> &
  DefaultButtonProps;

export const Link = memo(
  forwardRef(
    (
      {
        to,
        text,
        children = text,
        variant,
        newTab,
        className,
        baseCn,
        ...props
      }: LinkProps,
      ref: Ref<HTMLAnchorElement>
    ) => (
      <NextLink
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noreferrer" : undefined}
        className={cn(className, baseCn, {
          [tertiary]: variant === "tertiary",
        })}
        href={to}
        aria-label={text}
        ref={ref}
        replace
        {...props}
      >
        {children}
      </NextLink>
    )
  )
);
