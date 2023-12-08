import { type PropsWithChildren } from "react";
import cn from "classnames";

type ChipProps = PropsWithChildren<{
  className: string;
  text?: string;
}>;

export const Chip = (props: ChipProps) => {
  const { text, children = text, className } = props;

  return <div className={cn("chip", className)}>{children}</div>;
};
