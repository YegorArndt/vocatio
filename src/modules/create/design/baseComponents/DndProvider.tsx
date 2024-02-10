import {
  DndContext,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type PropsWithChildren, useState, useEffect, Fragment } from "react";
import { CSS } from "@dnd-kit/utilities";

import {
  ComponentContext,
  useComponentContext,
} from "../contexts/ComponentContext";
import { typedKeys } from "../../../../__archieved/draft/utils/common";
import { Toolbar } from "../toolbars";
import { cn } from "~/utils";
import {
  AnySection,
  BaseComponentType,
  HydratableComponent,
  SectionName,
  Sections,
} from "~/modules/create/design/types";
import { Contact } from "./Contact";
import { Group } from "./Group";
import { UserImage } from "~/modules/create/design/baseComponents/UserImage";
import { UserName } from "~/modules/create/design/baseComponents/UserName";
import { JobTitle } from "~/modules/create/design/baseComponents/JobTitle";
import { ProfessionalSummary } from "~/modules/create/design/baseComponents/ProfessionalSummary";
import { Heading } from "~/modules/create/design/baseComponents/Heading";
import { Skills } from "~/modules/create/design/baseComponents/Skills";
import { Experience } from "~/modules/create/design/baseComponents/Experience";
import { Entry } from "~/modules/create/design/baseComponents/Entry";
import { Languages } from "~/modules/create/design/baseComponents/Languages";
import { Education } from "~/modules/create/design/baseComponents/Education";
import { SkillsToolbar } from "../toolbars/skills/SkillsToolbar";
import { ExperienceToolbar } from "../toolbars/experience/ExperienceToolbar";
import { ExperienceEntryToolbar } from "../toolbars/experience/ExperienceEntryToolbar";

const { log } = console;

export type DndProviderProps = {
  sections: Sections;
  decorated?: boolean;
  className?: string;
};

type Component =
  | typeof Contact
  | typeof UserImage
  | typeof UserName
  | typeof JobTitle
  | typeof ProfessionalSummary
  | typeof Heading
  | typeof Skills
  | typeof Experience
  | typeof Entry
  | typeof Languages
  | typeof Education
  | typeof Group;

type Toolbar = typeof SkillsToolbar | typeof Toolbar;

type Mapping = Array<{
  keys: BaseComponentType[];
  Component: Component;
  Toolbar: Toolbar;
}>;

const mapping: Mapping = [
  { keys: ["contact"], Component: Contact, Toolbar },
  { keys: ["userImage"], Component: UserImage, Toolbar },
  { keys: ["userName"], Component: UserName, Toolbar },
  { keys: ["jobTitle"], Component: JobTitle, Toolbar },
  {
    keys: ["professionalSummary"],
    Component: ProfessionalSummary,
    Toolbar,
  },
  {
    keys: ["heading-1", "heading-2", "heading-3", "heading-4"],
    Component: Heading,
    Toolbar,
  },
  { keys: ["skills"], Component: Skills, Toolbar: SkillsToolbar },
  { keys: ["experience"], Component: Experience, Toolbar: ExperienceToolbar },
  { keys: ["entry"], Component: Entry, Toolbar: ExperienceEntryToolbar },
  { keys: ["languages"], Component: Languages, Toolbar },
  { keys: ["education"], Component: Education, Toolbar },
  {
    keys: ["group", "icon-group", "text"],
    Component: Group,
    Toolbar: Toolbar,
  },
];

export const getSectionIdByComponentId = (
  sections: Sections,
  componentId: string
) => {
  if (componentId in sections) return componentId;

  const sectionId = typedKeys(sections).find((id) => {
    const section = sections[id];

    if (!section) return null;

    return section.components.find((c) => c.id === componentId);
  });

  return sectionId;
};

const SortableItem = (
  props: PropsWithChildren<Pick<DndProviderProps, "decorated">>
) => {
  const { children, decorated } = props;
  const c = useComponentContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    node,
    isDragging,
  } = useSortable({ id: c.id, data: c });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { Toolbar } = mapping.find(({ keys }) => keys.includes(c.type))!;

  return (
    <Toolbar
      dndRef={setNodeRef}
      listeners={listeners}
      node={node}
      attributes={attributes}
      style={style}
      className={cn({
        "relative pl-6": decorated,
        "flex-center": c.type === "userImage",
        "list-disc": c.id?.includes("bullet"),
      })}
    >
      {decorated && (
        <Fragment>
          <div
            id={`ball-${c.id}`}
            className="absolute left-0 top-2 z-10 h-3 w-3 rounded-full border-2 border-solid !border-black bg-white"
          />
          <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
        </Fragment>
      )}
      {children}
    </Toolbar>
  );
};

const Section = (props: AnySection & Pick<DndProviderProps, "decorated">) => {
  const { id, components, className, decorated } = props;
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={components}
      strategy={verticalListSortingStrategy}
    >
      <ul ref={setNodeRef} className={className}>
        {components.map((c) => {
          const { Component, Toolbar } = mapping.find(({ keys }) =>
            keys.includes(c.type)
          )!;

          return (
            <ComponentContext.Provider key={c.id} value={c}>
              <SortableItem
                decorated={decorated && !c.type.includes("heading")}
              >
                <Component />
              </SortableItem>
            </ComponentContext.Provider>
          );
        })}
      </ul>
    </SortableContext>
  );
};

export const DndProvider = (props: DndProviderProps) => {
  const { sections: initialSections, ...rest } = props;
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState<null | string>(null);
  // const { updateDesign } = useDraftContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // useEffect(updateDesign, [sections]);
  /**
   * Reset sections when user selects a new design
   */
  useEffect(() => setSections(initialSections), [initialSections]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeSectionId = getSectionIdByComponentId(
      sections,
      active.id as string
    );
    const overSectionId = getSectionIdByComponentId(
      sections,
      over?.id as string
    );

    if (
      !activeSectionId ||
      !overSectionId ||
      activeSectionId === overSectionId
    ) {
      return;
    }

    setSections((prev) => {
      const activeItems = prev[activeSectionId as SectionName]?.components;
      const overItems = prev[overSectionId as SectionName]?.components;

      if (!activeItems || !overItems) {
        return prev;
      }

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over?.id);

      const newSections = { ...prev };

      // Remove the active item from its original section
      newSections[activeSectionId as SectionName]!.components =
        activeItems.filter((item) => item.id !== active.id);

      // Insert the active item into the new section at the correct position
      newSections[overSectionId as SectionName]!.components = [
        ...overItems.slice(0, overIndex),
        activeItems[activeIndex],
        ...overItems.slice(overIndex),
      ] as HydratableComponent[];

      // Update sectionId key of component
      newSections[overSectionId as SectionName]!.components = newSections[
        overSectionId as SectionName
      ]!.components.map((c) => ({
        ...c,
        sectionId: overSectionId as SectionName,
      }));

      return newSections;
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeSectionId = getSectionIdByComponentId(
      sections,
      active.id as string
    );
    const overSectionId = getSectionIdByComponentId(
      sections,
      over?.id as string
    );

    // const activeSectionId = active.data.current.sectionId;
    // const overSectionId = over?.data.current.sectionId;

    const outsideSortable = !activeSectionId || !overSectionId;
    const isSameSection = activeSectionId === overSectionId;
    const shouldAbort = outsideSortable || !isSameSection;

    if (shouldAbort) return;

    setSections((prev) => {
      const activeItems = prev[activeSectionId as SectionName]?.components;
      const overItems = prev[overSectionId as SectionName]?.components;

      if (!activeItems || !overItems) {
        return prev;
      }

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over?.id);

      if (activeIndex !== overIndex) {
        const newSections = { ...prev };

        // Move the active item within its section to the new position
        newSections[overSectionId as SectionName]!.components = arrayMove(
          newSections[overSectionId as SectionName]!.components,
          activeIndex,
          overIndex
        );

        // Update sectionId key of component
        newSections[overSectionId as SectionName]!.components = newSections[
          overSectionId as SectionName
        ]!.components.map((c) => ({
          ...c,
          sectionId: overSectionId as SectionName,
        }));

        return newSections;
      }

      return prev; // If nothing changed, return the current
    });

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {typedKeys(sections).map((sectionId) => (
        <Section
          key={sectionId as string}
          {...rest}
          {...sections[sectionId]!}
        />
      ))}
    </DndContext>
  );
};