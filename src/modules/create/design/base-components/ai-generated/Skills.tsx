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
import { get } from "lodash-es";
import { Tooltip } from "react-tooltip";

import type { RouterUser } from "~/modules/types";
import { DndProvider, type ImperativeHandleRef } from "../dnd/DndProvider";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useDesignContext } from "../../contexts/DesignContext";
import { api, cn } from "~/utils";
import { useEvents } from "~/hooks/useEvents";
import { Events, PopoverEvents } from "~/modules/events/types";
import { CvContextManager } from "~/modules/CvContextManager";
import { setter } from "./utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { Switch } from "~/components/ui/external/Switch";
import { BiPlus } from "react-icons/bi";
import { BsPlusCircleDotted } from "react-icons/bs";
import { Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { Badge } from "~/components/ui/external/Badge";
import { eventManager } from "~/modules/events/EventManager";
import { uuidv4 } from "~/modules/utils";
import { BUTTON_CN } from "../toolbars/constants";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "../toolbars/shared/MoveComponentButton";
import { PageBreakButton } from "../toolbars/shared/PageBreakButton";
import { useForceUpdate } from "~/hooks/useForceUpdate";

const { log } = console;

/**
 * CONTAINER. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

export const Skills = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const imperative = useRef<ImperativeHandleRef | null>(null);

  const handler = () => {
    const skills = CvContextManager.getInstance().getCv()?.skills;
    if (!skills) return;
    setter({ skills }, imperative, c);
  };

  useEffect(handler, []);

  useEvents({
    [Events.GEN_UPDATED]: handler,
    [PopoverEvents.SKILLS_UPDATED]: handler,
  });

  const className = cn(design.baseComponents?.skills?.className);

  return <DndProvider ref={imperative} sections={{}} className={className} />;
};

/**
 * POPOVER. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

type ActiveTab = 0 | 1;

const getGroupedSkills = (user: RouterUser | undefined) => {
  if (!user) return null;

  const gen = CvContextManager.getInstance().getGen();
  if (!gen) return null;

  const vacancySkills = get(gen, "vacancySkills", []);
  const userSkills = get(user, "skills", []).map((s) => s?.name);

  return {
    0: vacancySkills,
    1: userSkills,
  };
};

export const AddSkillsPopover = () => {
  const { data: user } = api.users.get.useQuery();
  const [activeTab, setActiveTab] = useState<ActiveTab>(0);
  const [search, setSearch] = useState("");
  const [displayOnlyMissing, setDisplayOnlyMissing] = useState(false);
  const forceUpdate = useForceUpdate();

  const groupedSkills = getGroupedSkills(user);

  if (!groupedSkills) return <Spinner size={10} />;

  const addSkill = (skill: string) => {
    CvContextManager.getInstance().updateCv((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: skill, id: uuidv4() }],
    }));
    eventManager.emit(PopoverEvents.SKILLS_UPDATED);
    forceUpdate();
  };

  const getFilteredSkills = () => {
    const currentSkills = CvContextManager.getInstance().getCv()?.skills;

    if (!currentSkills) return groupedSkills[activeTab as ActiveTab];

    return groupedSkills[activeTab]
      .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      .filter((s) =>
        displayOnlyMissing ? !currentSkills.find((cs) => cs.name === s) : true
      );
  };

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add skills
      </PopoverTrigger>

      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        side="left"
        sideOffset={130}
        className="h-full w-[800px] !bg-card"
      >
        <div className="size-full overflow-auto">
          <header className="grid grid-cols-2">
            {["From vacancy", "From my skills"].map((tab, i) => (
              <Button
                key={tab}
                text={tab}
                onClick={() => setActiveTab(i as ActiveTab)}
                className={cn(
                  "hover:main-hover flex-center gap-3 p-2 text-lg",
                  {
                    "main-hover border-bottom": i === activeTab,
                  }
                )}
                endIcon={
                  <Badge className="rounded-md bg-red">
                    {groupedSkills[i as ActiveTab].length}
                  </Badge>
                }
              />
            ))}
          </header>
          <input
            placeholder="Search skills here..."
            className="h-[70px] w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <section className="flex flex-wrap gap-2 overflow-auto">
            {getFilteredSkills().map((s) => (
              <Button
                key={s}
                frontIcon={<BiPlus />}
                text={s}
                className="flex-y rounded-md border bg-primary p-2"
                onClick={() => addSkill(s)}
              />
            ))}
          </section>
          <label className="flex-y gap-2 py-4">
            <Switch
              checked={displayOnlyMissing}
              onClick={() => setDisplayOnlyMissing(!displayOnlyMissing)}
            />
            Show only skills I haven&apos;t added yet
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * TOOLBAR. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

type ToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const SkillsToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;

  return (
    <li ref={dndRef} data-tooltip-id="skills" className={className} {...rest}>
      {children}
      <Tooltip
        id="skills"
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-tooltip -translate-y-[50px] transform !p-0"
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                Skills section
              </header>
              <section className="flex-center gap-1">
                <TooltipProvider>
                  <PageBreakButton />
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                  <AddSkillsPopover />
                </TooltipProvider>
              </section>
            </div>
          );
        }}
      />
    </li>
  );
};
