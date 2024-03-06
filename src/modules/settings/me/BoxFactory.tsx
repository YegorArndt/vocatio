import { ImageBox } from "./boxes/components/ImageBox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/external/Accordion";
import { isEmpty, isNil, pick, startCase } from "lodash-es";
import { Checkmark } from "~/components/icons";
import { api } from "~/utils";
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
import { typedEntries } from "~/modules/utils";
import { useState } from "react";
import { Button } from "~/components/ui/buttons/Button";
import { SkillsBox } from "./boxes/components/SkillsBox";
import { ContactBox } from "./boxes/components/ContactBox";
import { LanguagesBox } from "./boxes/components/LanguagesBox";
import { ExperienceBox } from "./boxes/components/ExperienceBox";
import { HiPlusCircle } from "react-icons/hi2";

const { log } = console;

type BoxFactoryProps = {
  boxName: BoxName;
  updateKey: BoxName; // Helps update each box individually with LinkedIn.
};

type Component =
  | typeof ImageBox
  | typeof MainBox
  | typeof EntryBox
  | typeof BigEntryBox;

type Mapping = Record<
  BoxName,
  {
    Component: Component;
    dataKeys: (keyof RouterUser)[];
    stubby?: Partial<RouterUser>;
  }
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
    Component: ContactBox,
    dataKeys: ["contact"],
  },
  skills: {
    Component: SkillsBox,
    dataKeys: ["skills"],
  },
  languages: {
    Component: LanguagesBox,
    dataKeys: ["languages"],
    // @ts-ignore
    stubby: { languages: [{ name: "English", value: "Expert" }] },
  },
  experience: {
    Component: ExperienceBox,
    dataKeys: ["experience"],
  },
  education: {
    Component: BigEntryBox,
    dataKeys: ["education"],
  },
};

const checkIfDataComplete = (data: Partial<RouterUser> | undefined) => {
  const fieldsThatCanFail = ["professionalSummary"];

  return (
    !!data &&
    typedEntries(data).every(([k, v]) => {
      if (fieldsThatCanFail.includes(k)) return true;
      return !isNil(v) && !isEmpty(v);
    })
  );
};

export const BoxFactory = (props: BoxFactoryProps) => {
  const { boxName, updateKey } = props;

  const { data: user } = api.users.get.useQuery();
  const { mutate: updateDatabase, isLoading: isUpdating } =
    api.users.update.useMutation();

  const scrollIntoViewRef = useScrollIntoView({
    shouldScroll: boxName === updateKey,
  });

  const [isAddingManually, setIsAddingManually] = useState(false);

  const { Component, dataKeys } = mapping[boxName];

  const update = (updatedUser: Partial<RouterUser>) => {
    /**
     * Update database.
     */
    // @ts-ignore
    updateDatabase(updatedUser, {
      onSuccess: (user) => {
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
  const isDataComplete = checkIfDataComplete(data);

  return (
    user &&
    data && (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <AnimatedDiv
            className="flex flex-col gap-8 rounded-md border bg-card"
            ref={scrollIntoViewRef}
          >
            <Accordion
              type="single"
              collapsible
              defaultValue={
                boxName === updateKey || isDataComplete ? undefined : "item-1"
              }
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  id={boxName}
                  className="hover:main-hover group grid w-full grid-cols-[1fr,20px] gap-5 p-6 text-lg"
                >
                  <span className="flex-between w-full">
                    <h6 className="flex-y gap-2 group-hover:underline">
                      {isDataComplete ? <Checkmark /> : <>❌ </>}
                      {startCase(boxName)}
                    </h6>
                    <UpdateWithExtensionLink
                      boxName={boxName}
                      linkedinId={user.linkedinId}
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="mt-6 p-6">
                  {isDataComplete ? (
                    <Component
                      data={data}
                      update={update}
                      isUpdating={isUpdating}
                      boxName={boxName}
                    />
                  ) : isAddingManually ? (
                    <Component
                      data={mapping[boxName].stubby}
                      update={update}
                      isUpdating={isUpdating}
                      boxName={boxName}
                    />
                  ) : (
                    <div className="flex-center">
                      <Button
                        frontIcon={<HiPlusCircle />}
                        text={`I want to add ${boxName} manually`}
                        onClick={() => setIsAddingManually(true)}
                        className="flex-y clr-ghost sm primary"
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedDiv>
        </ResizablePanel>
        <ResizableHandle withHandle className="!cursor-col-resize" />
        <ResizablePanel />
      </ResizablePanelGroup>
    )
  );
};
