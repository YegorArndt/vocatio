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
import { type PropsWithChildren, useState } from "react";
import { CSS } from "@dnd-kit/utilities";

import { useDraftContext } from "../draft/DraftContext";
import { ComponentContext, useComponentContext } from "./ComponentContext";
import type { NormalizedComponent } from "../draft/types/components";
import type { Sections, SectionId, Section } from "../draft/types/sections";
import { typedKeys } from "../draft/utils/common";
import { ComponentFactory } from "./ComponentFactory";
import { ComponentToolbar } from "./components/ComponentToolbar";

export const getSectionIdByComponentId = (
  sections: Sections,
  componentId: string
) => {
  if (componentId in sections) return componentId;

  const sectionId = Object.keys(sections).find((name) => {
    const section = sections[name as SectionId];

    if (!section) return null;

    return section.components.find(
      (c: NormalizedComponent) => c.id === componentId
    );
  });

  return sectionId;
};

const SortableItem = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const c = useComponentContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id, data: c });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: "100%",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ComponentToolbar
      dndRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      style={style}
    >
      {children}
    </ComponentToolbar>
  );
};

const Section = (props: Section) => {
  const { id, components, className } = props;
  const { setNodeRef, active } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={components}
      strategy={verticalListSortingStrategy}
    >
      <section ref={setNodeRef} className={className}>
        {components.map((c) => (
          <ComponentContext.Provider key={c.id} value={c}>
            <SortableItem>
              <ComponentFactory />
            </SortableItem>
          </ComponentContext.Provider>
        ))}
      </section>
    </SortableContext>
  );
};

export const DndProvider = () => {
  const { design, updateDesign } = useDraftContext();
  const [activeId, setActiveId] = useState<null | string>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeSectionId = getSectionIdByComponentId(
      design.sections,
      active.id as string
    );
    const overSectionId = getSectionIdByComponentId(
      design.sections,
      over?.id as string
    );

    if (
      !activeSectionId ||
      !overSectionId ||
      activeSectionId === overSectionId
    ) {
      return;
    }

    updateDesign((d) => {
      const activeItems = d.sections[activeSectionId as SectionId]?.components;
      const overItems = d.sections[overSectionId as SectionId]?.components;

      if (!activeItems || !overItems) {
        return d;
      }

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over?.id);

      const newSections = { ...d.sections };

      // Remove the active item from its original section
      newSections[activeSectionId as SectionId]!.components =
        activeItems.filter((item) => item.id !== active.id);

      // Recalculate order of all items in the original section
      newSections[activeSectionId as SectionId]!.components = newSections[
        activeSectionId as SectionId
      ]!.components.map((c, index) => ({
        ...c,
        order: index,
      }));

      // Insert the active item into the new section at the correct position
      newSections[overSectionId as SectionId]!.components = [
        ...overItems.slice(0, overIndex),
        activeItems[activeIndex],
        ...overItems.slice(overIndex),
      ] as NormalizedComponent[];

      // Recalculate order of all items in the new section
      newSections[overSectionId as SectionId]!.components = newSections[
        overSectionId as SectionId
      ]!.components.map((c, index) => ({
        ...c,
        order: index,
      }));

      // Update sectionId key of component
      newSections[overSectionId as SectionId]!.components = newSections[
        overSectionId as SectionId
      ]!.components.map((c, index) => ({
        ...c,
        sectionId: overSectionId as SectionId,
      }));

      return { ...d, sections: newSections };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeSectionId = getSectionIdByComponentId(
      design.sections,
      active.id as string
    );
    const overSectionId = getSectionIdByComponentId(
      design.sections,
      over?.id as string
    );

    if (
      !activeSectionId ||
      !overSectionId ||
      activeSectionId !== overSectionId
    ) {
      return;
    }

    updateDesign((d) => {
      const activeIndex = d.sections[
        activeSectionId as SectionId
      ]?.components.findIndex((c) => c.id === active.id);
      const overIndex = d.sections[
        overSectionId as SectionId
      ]?.components.findIndex((c) => c.id === over?.id);

      if (activeIndex !== overIndex) {
        const newSections = { ...d.sections };

        // Move the active item within its section to the new position
        newSections[overSectionId as SectionId]!.components = arrayMove(
          newSections[overSectionId as SectionId]!.components,
          activeIndex!,
          overIndex!
        );

        // Recalculate order of all items in the section
        newSections[overSectionId as SectionId]!.components = newSections[
          overSectionId as SectionId
        ]!.components.map((c, index) => ({
          ...c,
          order: index,
        }));

        // Update sectionId key of component
        newSections[overSectionId as SectionId]!.components = newSections[
          overSectionId as SectionId
        ]!.components.map((c, index) => ({
          ...c,
          sectionId: overSectionId as SectionId,
        }));

        return { ...d, sections: newSections };
      }

      return d; // If nothing changed, return the current design
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
      {typedKeys(design.sections).map((sectionId) => (
        <Section key={sectionId} {...design.sections[sectionId]!} />
      ))}
    </DndContext>
  );
};
