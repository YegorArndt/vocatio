import cn from "classnames";
import { startCase } from "lodash-es";
import { type PropsWithChildren } from "react";
import { FineTuneLink } from "./FineTuneLink";
import { EntryFor } from "../types";

const { log } = console;

type WrapperProps = PropsWithChildren<{
  omitLink?: boolean;
  entryFor?: string;
  className?: string;
}>;

export const Wrapper = (props: WrapperProps) => {
  const { children, entryFor, className, omitLink } = props;

  return (
    <section
      className={cn(
        "flex flex-col gap-8 rounded-md border bg-card pt-6 [&>*]:px-6",
        className
      )}
    >
      <header className="flex-between">
        <h4 id={entryFor}>{startCase(entryFor)}</h4>
        {!omitLink && <FineTuneLink entryFor={entryFor as EntryFor} />}
      </header>
      {children}
    </section>
  );
};
