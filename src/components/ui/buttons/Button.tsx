import cn from "classnames";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type ButtonProps = {
  text?: string;
  baseCn?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: PropsWithChildren<ButtonProps>) => {
  const {
    type = "button",
    text,
    children = text,
    baseCn,
    className,
    ...rest
  } = props;

  return (
    <button type={type} className={cn("common", baseCn, className)} {...rest}>
      <span className="content">{children}</span>
    </button>
  );
};
