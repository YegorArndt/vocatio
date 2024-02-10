import { usePersistentData } from "~/hooks/usePersistentData";
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
import { RouterUser } from "~/modules/create/design/extension/types";
import { useScrollIntoView } from "~/hooks/useScrollIntoView";
import { MainBox } from "./boxes/components/MainBox";
import { BigEntryBox } from "./boxes/components/BigEntryBox";
import { EntryBox } from "./boxes/components/EntryBox";
import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { linkedinBaseUrl } from "~/constants";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import { LinkedinColor } from "~/icons";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "~/components/ui/external/Resizable";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const { log } = console;

export type BoxName =
  | "image"
  | "main"
  | "contact"
  | "skills"
  | "languages"
  | "experience"
  | "education";

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

const UpdateWithExtensionLink = (props: {
  boxName: BoxName;
  linkedinId: string | null | undefined;
}) => {
  const { boxName, linkedinId } = props;

  /**
   * You can redirect the user to linkedinBaseUrl and LinkedIn will recognize the user anyway.
   * However, redirecting to a specific profile section without the LinkedIn ID will not work.
   */
  const baseUrlWorks = ["main", "contact", "image"].includes(boxName);
  const to = baseUrlWorks ? "" : `${linkedinId}/details/${boxName}`;
  const disabled = !linkedinId && !baseUrlWorks;

  return disabled ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="flex-y cursor-not-allowed text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          ⚠️&nbsp;&nbsp;Update main section
        </TooltipTrigger>
        <TooltipContent>
          This will also update the Contact section adding your LinkedIn ID. It
          is needed in order to navigate to your LinkedIn {boxName} section.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link
      frontIcon={<LiaExternalLinkAltSolid size={23} />}
      text="Update with extension via:"
      endIcon={<LinkedinColor fontSize={23} />}
      to={`${linkedinBaseUrl}${to}`}
      onClick={(e) => {
        e.stopPropagation();
        toast.info(
          `Open the extension while on LinkedIn and click "Update ${boxName}"`,
          {
            duration: 10000,
          }
        );
      }}
      baseCn="flex-y hover:underline text-[1rem]"
      newTab
    />
  );
};

export const BoxFactory = (props: BoxFactoryProps) => {
  const { boxName, updateKey, className } = props;
  const { data: user } = api.users.get.useQuery();
  const { ls, updateLs } = usePersistentData();
  const { mutate: updateDatabase, isLoading: isUpdating } =
    api.users.update.useMutation();

  const scrollIntoViewRef = useScrollIntoView({
    shouldScroll: boxName === updateKey,
  });

  const { Component, dataKeys } = mapping[boxName];

  const update = (updatedUser: Partial<RouterUser>) => {
    /**
     * Update database. On success - update local storage.
     */
    //@ts-ignore
    updateDatabase(updatedUser, {
      onSuccess: () => {
        // @ts-ignore
        updateLs({ user: { ...user, ...updatedUser } });
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

  const data = ls.user && pick(ls.user, dataKeys);

  const isDataComplete =
    data &&
    dataKeys.every((key) => [isNil, isEmpty].every((fn) => !fn(data[key])));

  return (
    ls.user && (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
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
                  <span className="flex-between w-full">
                    <h6 className="flex-y gap-2 group-hover:underline">
                      {isDataComplete ? <Checkmark /> : <>❌ </>}
                      {startCase(boxName)}
                    </h6>
                    <UpdateWithExtensionLink
                      boxName={boxName}
                      linkedinId={ls.user.linkedinId}
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
