import cn from "classnames";

import { Chip } from "./Chip";
import { type DecoProps } from "./Spinner";

export const ComingSoon = (props: DecoProps) => {
  const { className, ...rest } = props;

  return (
    <Chip
      text="Coming soon"
      className={cn(
        "bg-sky max-h-[30px] max-w-[110px] whitespace-nowrap p-1 clr-white",
        className
      )}
      {...rest}
    />
  );
};
