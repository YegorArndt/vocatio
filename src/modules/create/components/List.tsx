import { type HTMLAttributes } from "react";
import cn from "classnames";

import { Autoresize, type AutoresizeProps } from "./Autoresize";

export type ListProps = {
  autoresizes: AutoresizeProps[];
} & HTMLAttributes<HTMLLIElement>;

export const List = (props: ListProps) => {
  const { autoresizes, className } = props;

  return (
    <ul className="flex flex-col gap-[1em]">
      {autoresizes.map((autoresizeProps) => (
        <li key={autoresizeProps.id} className={cn("list-disc", className)}>
          <Autoresize {...autoresizeProps} />
        </li>
      ))}
    </ul>
  );
};
