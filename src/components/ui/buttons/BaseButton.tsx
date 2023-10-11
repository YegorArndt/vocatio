import cn from "classnames";
import { type PropsWithChildren } from "react";
import { type BaseProps } from "../types";
import { reset } from "../constants";

export type DefaultButtonProps = {
  text?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseProps;

export const BaseButton = (props: PropsWithChildren<DefaultButtonProps>) => {
  const {
    type = "button",
    text,
    children = text,
    baseCn,
    className,
    ...other
  } = props;

  return (
    <button type={type} className={cn(reset, baseCn, className)} {...other}>
      {children}
    </button>
  );
};
