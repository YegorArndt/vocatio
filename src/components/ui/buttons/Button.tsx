import cn from "classnames";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  Ref,
} from "react";

export type ButtonProps = {
  text?: string;
  baseCn?: string;
  frontIcon?: ReactNode;
  endIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef(
  (props: PropsWithChildren<ButtonProps>, ref: Ref<HTMLButtonElement>) => {
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
      <button type={type} ref={ref} className={cn(baseCn, className)} {...rest}>
        {frontIcon && <span className="mr-2">{frontIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
