import {
  type HTMLAttributes,
  type MutableRefObject,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Tooltip } from "react-tooltip";

import type { CvExperienceEntry } from "~/modules/init-gen/types";
import { setter, type Imperative } from "./utils";
import { api, cn } from "~/utils";
import { useComponentContext } from "../../contexts/ComponentContext";
import { DndProvider } from "../dnd/DndProvider";
import { useDesignContext } from "../../contexts/DesignContext";
import { useEvents } from "~/hooks/useEvents";
import { Events, PopoverEvents } from "~/modules/events/types";
import { CvContextManager } from "~/modules/CvContextManager";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { BlurImage, Spinner } from "~/components";
import { Gpt } from "~/components/icons";
import { Button } from "~/components/ui/buttons/Button";
import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/external/Carousel";
import { eventManager } from "~/modules/events/EventManager";
import { BUTTON_CN } from "../toolbars/constants";
import { stripHtmlTags, uuidv4 } from "~/modules/utils";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "../toolbars/shared/MoveComponentButton";
import { useCvContext } from "~/hooks/useCvContext";
import { RouterUser } from "~/modules/types";
import { AiPicker } from "~/components/AiPicker";
import { BsPlusCircleDotted } from "react-icons/bs";
import { HiPlusCircle } from "react-icons/hi2";
import { debounce } from "lodash-es";

const { log } = console;

const getEntry = (id: string) => {
  const experience = CvContextManager.getInstance().getCv()?.experience;
  if (!experience) return;
  return experience.find((x) => x.id === id);
};

/**
 * ENTRY. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

export const ExperienceEntry = () => {
  const c = useComponentContext();
  const imperative = useRef<Imperative>(null);

  const handler = () => {
    const entry = getEntry(c.id);
    if (!entry) return;
    setter(entry, imperative, c);
  };

  useEffect(handler, []);

  useEvents({
    [Events.GEN_UPDATED]: handler,
    [PopoverEvents.BULLETS_UPDATED]: handler,
  });

  return <DndProvider ref={imperative} sections={{}} />;
};

/**
 * CONTAINER. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

export const Experience = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const imperative = useRef<Imperative>(null);

  const handler = () => {
    const experience = CvContextManager.getInstance().getCv()?.experience;
    if (experience) setter({ experience }, imperative, c);
  };

  useEffect(handler, []);

  useEvents({
    [PopoverEvents.ENTRY_ADDED]: handler,
  });

  const className = cn(design.baseComponents?.experience?.className);

  return <DndProvider ref={imperative} className={className} sections={{}} />;
};

/**
 * POPOVER. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

type ActiveTab = 0 | 1;

const getChunkedBullets = (
  entry: CvExperienceEntry,
  originalEntry: RouterUser["experience"][number],
  activeTab: ActiveTab
) => {
  const rawBullets = {
    0: entry.bullets.map((b) => stripHtmlTags(b.value)),
    1: originalEntry?.bullets,
  };

  const chunkedBullets = rawBullets[activeTab]?.reduce(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 4);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex]?.push(item);

      return resultArray;
    },
    [] as string[][]
  );

  return chunkedBullets;
};

const addBullet = (bullet: string, entryId: string) => {
  CvContextManager.getInstance().updateCv((prev) => {
    const entry = prev.experience.find((e) => e.id === entryId);
    if (!entry) return prev;
    entry.bullets.push({ id: uuidv4() + "-bullet", value: bullet });

    const newEntries = prev.experience.map((e) => {
      if (e.id === entryId) return entry;
      return e;
    });

    return {
      ...prev,
      experience: newEntries,
    };
  });
  eventManager.emit(PopoverEvents.BULLETS_UPDATED);
};

export const AddBulletPointsPopover = () => {
  const c = useComponentContext();
  const { data: user } = api.users.get.useQuery();
  const [activeTab, setActiveTab] = useState<ActiveTab>(0);

  const entry = getEntry(c.id);
  if (!entry || !user) return <Spinner size={10} />;
  const originalEntry = user.experience.find((exp) => exp.id === c.id)!;

  const bulletPoints = getChunkedBullets(entry, originalEntry, activeTab);

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <HiPlusCircle /> Add bullet points
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        side="top"
        className="flex w-[600px] flex-col gap-3 !bg-card"
      >
        <header className="grid grid-cols-2">
          {[0, 1].map((i) => (
            <Button
              key={i}
              frontIcon={0 === i ? <Gpt /> : null}
              text={i === 0 ? "Generated" : "Original"}
              onClick={() => setActiveTab(i as ActiveTab)}
              className={cn("hover:main-hover flex-center gap-3 p-2 text-lg", {
                "main-hover border-bottom": i === activeTab,
              })}
            />
          ))}
        </header>
        <div className="flex flex-col gap-3">
          <Carousel>
            <header className="my-5 grid grid-cols-2">
              <CarouselPrevious
                text="Back"
                className="flex-center relative h-auto w-auto gap-2 !bg-transparent"
              />
              <CarouselNext
                text="View more"
                className="flex-center relative h-auto w-auto gap-2 !bg-transparent"
              />
            </header>
            <CarouselContent>
              {bulletPoints?.map((chunk, index) => (
                <CarouselItem key={index}>
                  {chunk?.map((bullet) => (
                    <Button
                      key={bullet}
                      frontIcon={<BsPlusCircleDotted />}
                      text={bullet.replace("•", "")}
                      onClick={() => addBullet(bullet, c.id)}
                      className="clr-ghost flex-y gap-3 bg-card p-3 text-left !text-weiss hover:bg-primary"
                    />
                  ))}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * CONTAINER TOOLBAR. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

type ToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const ExperienceToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handler = () => {
      debounce(() => setIsTyping(!isTyping), 1000);
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <li
      ref={dndRef}
      data-tooltip-id="experience"
      className={className}
      {...rest}
    >
      {children}
      <Tooltip
        id="experience"
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("!z-tooltip -translate-y-[50px] transform !p-0")}
        hidden={isTyping}
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex flex-col" data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                Experience section
              </header>
              <div className="flex-center">
                <TooltipProvider>
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                  <AddExperiencePopover />
                </TooltipProvider>
              </div>
            </div>
          );
        }}
      />
    </li>
  );
};

/**
 * ENTRY TOOLBAR. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

export const ExperienceEntryToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;
  const c = useComponentContext();
  const { cv } = useCvContext() ?? {};

  const entry = cv?.experience?.find((e) => e.id === c.id);
  const { place, image } = entry || {};

  const entryHeader = place || "entry";

  return (
    <li ref={dndRef} data-tooltip-id={c.id} className={className} {...rest}>
      {children}
      <Tooltip
        id={c.id}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-modal !p-0"
        clickable
        openOnClick
        place="right"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex flex-col" data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                <BlurImage src={image} /> {entryHeader}
              </header>
              <section className="flex-center">
                <TooltipProvider>
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                  <AddBulletPointsPopover />
                </TooltipProvider>
              </section>
            </div>
          );
        }}
      />
    </li>
  );
};

/**
 * ADD ENTRY POPOVER. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

const addEntry = (user: RouterUser) => {
  const gen = CvContextManager.getInstance().getGen();

  const newEntry: CvExperienceEntry = {
    bullets: [{ id: `${uuidv4()}-bullet`, value: "Bullet point" }],
    skills: user.skills,
    id: uuidv4(),
    image: "",
    period:
      user.experience[0]?.period || gen?.experience[0]?.period || "Period",
    place: "Company name",
    title: user.jobTitle || gen?.experience[0]?.title || "Job title",
  };

  CvContextManager.getInstance().updateCv((prev) => {
    const entries = prev.experience;
    const newEntries = [newEntry, ...entries];

    return {
      ...prev,
      experience: newEntries,
    };
  });
  eventManager.emit(PopoverEvents.ENTRY_ADDED);
};

export const AddExperiencePopover = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2 text-default")}>
        <HiPlusCircle fontSize={19} />
        Add new entry
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        side="top"
        className="flex w-[600px] flex-col gap-3 !bg-card"
      >
        {user ? (
          <Button
            frontIcon={<HiPlusCircle fontSize={19} />}
            text="Add a blank entry"
            baseCn="flex-y hover:underline"
            onClick={() => addEntry(user)}
          />
        ) : (
          <Spinner size={10} />
        )}
        <div className="flex-y gap-4 whitespace-nowrap">
          Or tailor it to job posting. Click on the model to generate
          <AiPicker onModelChange={(model) => null} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
