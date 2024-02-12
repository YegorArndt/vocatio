import { ImageBox } from "./boxes/components/ImageBox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/external/Accordion";
import { isEmpty, isNil, pick, startCase } from "lodash-es";
import { Checkmark } from "~/components/icons";
import { api, cn } from "~/utils";
import { useScrollIntoView } from "~/hooks/useScrollIntoView";
import { MainBox } from "./boxes/components/MainBox";
import { BigEntryBox } from "./boxes/components/BigEntryBox";
import { EntryBox } from "./boxes/components/EntryBox";
import { toast } from "sonner";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/external/Resizable";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { RouterUser } from "~/modules/types";
import { BoxName } from "./types";
import { UpdateWithExtensionLink } from "./UpdateWithExtensionLink";
import { EnhanceExperienceDrawer } from "./enhance-drawer/EnhanceExperienceDrawer";

const { log } = console;

type BoxFactoryProps = {
  boxName: BoxName;
  updateKey: BoxName;
  className?: string;
};

type Component =
  | typeof ImageBox
  | typeof MainBox
  | typeof EntryBox
  | typeof BigEntryBox;

type Mapping = Record<
  BoxName,
  { Component: Component; dataKeys: (keyof RouterUser)[] }
>;

const mapping: Mapping = {
  image: {
    Component: ImageBox,
    dataKeys: ["image"],
  },
  main: {
    Component: MainBox,
    dataKeys: ["name", "jobTitle", "professionalSummary"],
  },
  contact: {
    Component: EntryBox,
    dataKeys: ["contact"],
  },
  skills: {
    Component: EntryBox,
    dataKeys: ["skills"],
  },
  languages: {
    Component: EntryBox,
    dataKeys: ["languages"],
  },
  experience: {
    Component: BigEntryBox,
    dataKeys: ["experience"],
  },
  education: {
    Component: BigEntryBox,
    dataKeys: ["education"],
  },
};

export const BoxFactory = (props: BoxFactoryProps) => {
  const { boxName, updateKey, className } = props;

  const { data: user } = api.users.get.useQuery();
  const { mutate: updateDatabase, isLoading: isUpdating } =
    api.users.update.useMutation();

  const scrollIntoViewRef = useScrollIntoView({
    shouldScroll: boxName === updateKey,
  });

  const { Component, dataKeys } = mapping[boxName];

  const update = (updatedUser: Partial<RouterUser>) => {
    /**
     * Update database.
     */
    // @ts-ignore
    updateDatabase(updatedUser, {
      onSuccess: () => {
        const keys = dataKeys.map(startCase).join(", ");
        toast.success(`Updated ${keys}.`);
      },
      onError: () => {
        toast.error(
          "Error updating data. Please try again or report the issue."
        );
      },
    });
  };

  const data = user && pick(user, dataKeys);

  const isDataComplete = !!(
    data &&
    dataKeys.every((key) => [isNil, isEmpty].every((fn) => !fn(data[key])))
  );

  return (
    user &&
    data && (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <AnimatedDiv
            className={cn(
              "flex flex-col gap-8 rounded-md border bg-card",
              className
            )}
            ref={scrollIntoViewRef}
          >
            <Accordion
              type="single"
              collapsible
              defaultValue={
                boxName === updateKey || !isDataComplete ? "item-1" : undefined
              }
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  id={boxName}
                  className="group grid w-full grid-cols-[1fr,20px] gap-5 p-6 text-lg hover:bg-hover"
                >
                  <span
                    className={cn("flex w-full", {
                      "justify-between": boxName !== "experience",
                    })}
                  >
                    <h6 className="flex-y gap-2 group-hover:underline">
                      {isDataComplete ? <Checkmark /> : <>❌ </>}
                      {startCase(boxName)}
                    </h6>
                    {boxName === "experience" && <EnhanceExperienceDrawer />}
                    <UpdateWithExtensionLink
                      boxName={boxName}
                      linkedinId={user.linkedinId}
                      className={cn({
                        "ml-auto": boxName === "experience",
                      })}
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="mt-6 p-6">
                  <Component
                    data={data}
                    update={update}
                    isUpdating={isUpdating}
                    boxName={boxName}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedDiv>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel />
      </ResizablePanelGroup>
    )
  );
};
