import cn from "classnames";
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type ButtonProps = {
  text?: string;
  baseCn?: string;
  frontIcon?: ReactNode;
  endIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: PropsWithChildren<ButtonProps>) => {
  const {
    type = "button",
    text,
    children = text,
    baseCn,
    className,
    frontIcon,
    endIcon,
    ...rest
  } = props;

  return (
    <button type={type} className={cn(baseCn, className)} {...rest}>
      {frontIcon && <span className="mr-2">{frontIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};
