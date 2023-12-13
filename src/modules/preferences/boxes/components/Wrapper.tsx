import cn from "classnames";
import { startCase } from "lodash-es";
import { type PropsWithChildren } from "react";
import { FineTuneBoxProps } from "../types";
import { FineTuneLink } from "./FineTuneLink";

const { log } = console;

type BoxProps = PropsWithChildren<FineTuneBoxProps>;

export const Wrapper = (props: BoxProps) => {
  const { children, entryFor, className } = props;

  return (
    <section
      className={cn(
        "flex flex-col gap-8 rounded-md border bg-card pt-6 [&>*]:px-6",
        className
      )}
    >
      <header className="flex-between">
        <h4 id={entryFor}>{startCase(entryFor)}</h4>
        <FineTuneLink entryFor={entryFor} />
      </header>
      {children}
    </section>
  );
};
