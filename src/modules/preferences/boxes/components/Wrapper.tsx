import cn from "classnames";
import { startCase } from "lodash-es";
import { type PropsWithChildren } from "react";
import { FineTuneLink } from "./FineTuneLink";
import { EntryFor } from "../types";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "~/components/external/Accordion";

const { log } = console;

type WrapperProps = PropsWithChildren<{
  omitLink?: boolean;
  entryFor?: string;
  className?: string;
  id?: string;
  defaultOpen?: boolean;
}>;

const item = "item-1";

export const Wrapper = (props: WrapperProps) => {
  const { children, entryFor, className, omitLink, defaultOpen } = props;

  return (
    <section
      className={cn(
        "flex flex-col gap-8 rounded-md border bg-card [&>*]:px-6",
        className
      )}
    >
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? "item-1" : ""}
      >
        <AccordionItem value="item-1">
          <header className="flex-between py-6">
            <h4 id={entryFor}>{startCase(entryFor)}</h4>
            <div className="flex-y gap-5">
              {!omitLink && <FineTuneLink entryFor={entryFor as EntryFor} />}
              <AccordionTrigger />
            </div>
          </header>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
