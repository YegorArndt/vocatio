import { type PropsWithChildren } from "react";
import cn from "classnames";

type ChipProps = PropsWithChildren<{
  className?: string;
}>;

export const Chip = (props: ChipProps) => {
  const { children, className } = props;

  return <div className={cn("chip bg-[#1f1f1f]", className)}>{children}</div>;
};
