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
import { FaTrashAlt } from "react-icons/fa";

import { ComponentFactory } from "./ComponentFactory";
import { useDraftContext } from "../draft/DraftContext";
import { EditorTooltip } from "./components/editor-tooltip";
import cn from "classnames";
import { Tooltip } from "react-tooltip";
import type { DraftComponent, Section, Sections } from "../draft/types";

export const getSectionIdByComponentId = (
  sections: Sections,
  componentId: string
) => {
  if (componentId in sections) return componentId;

  const sectionId = Object.keys(sections).find((name) => {
    const section = sections[name];

    if (!section) return null;

    return section.components.find((c: DraftComponent) => c.id === componentId);
  });

  return sectionId;
};

const SortableItem = (
  props: PropsWithChildren<{ component: DraftComponent }>
) => {
  const { component: c, children } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id, data: c });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
    marginBottom: "4px",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <EditorTooltip
      dndRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      style={style}
      component={c}
    >
      {children}
    </EditorTooltip>
  );
};

const Section = (props: Section) => {
  const { id, components, className } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={components}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className={className}>
        {components.map((c) => (
          <SortableItem key={c.id} component={c}>
            <ComponentFactory component={c} />
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
};

const id = "garbage";

const Garbage = (props: Pick<Section, "components">) => {
  const { components } = props;
  const [tooltipShown, setTooltipShown] = useState(false);

  const { setNodeRef, isOver, active } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={components}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={cn("fixed right-0 top-[110px] h-screen w-[20vw]", {
          "danger-zone": isOver,
        })}
      >
        <div
          className="flex-center size-full"
          onMouseEnter={() => setTooltipShown(true)}
          onMouseLeave={() => setTooltipShown(false)}
          data-tooltip-id={id}
        >
          <FaTrashAlt
            size={25}
            id={`${id}-bucket`}
            className="pointer-events-none"
          />
          {components.map((c) => (
            <SortableItem key={c.id} component={c}>
              <ComponentFactory component={c} />
            </SortableItem>
          ))}
        </div>
        <Tooltip
          anchorSelect={`#${id}-bucket`}
          isOpen={Boolean(active && tooltipShown)}
          place="top"
          opacity={1}
          content="Move to Trash"
          variant="error"
        />
      </div>
    </SortableContext>
  );
};

export const DndProvider = () => {
  const { design, updateDesign } = useDraftContext();
  const [activeId, setActiveId] = useState<null | string>(null);
  const [deleted, setDeleted] = useState<DraftComponent[]>([]);

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

    updateDesign((currentDesign) => {
      const activeItems = currentDesign.sections[activeSectionId]?.components;
      const overItems = currentDesign.sections[overSectionId]?.components;

      if (!activeItems || !overItems) {
        return currentDesign;
      }

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over?.id);

      let newSections = { ...currentDesign.sections };

      // Remove the active item from its original section
      (newSections[activeSectionId] as Section).components = activeItems.filter(
        (item) => item.id !== active.id
      );

      // Insert the active item into the new section at the correct position
      (newSections[overSectionId] as Section).components = [
        ...overItems.slice(0, overIndex),
        activeItems[activeIndex],
        ...overItems.slice(overIndex),
      ] as DraftComponent[];

      return { ...currentDesign, sections: newSections };
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

    if (overSectionId === undefined) {
      // Delete the component
      updateDesign((currentDesign) => {
        const newSections = { ...currentDesign.sections };

        Object.keys(newSections).forEach((sectionId) => {
          (newSections[sectionId] as Section).components = (
            newSections[sectionId] as Section
          ).components.filter((c) => c.id !== active.id);
        });

        return { ...currentDesign, sections: newSections };
      });

      setActiveId(null);
      // setDeleted((deleted) => [...(deleted ?? []), active.data.current]);
      return;
    }

    if (
      !activeSectionId ||
      !overSectionId ||
      activeSectionId !== overSectionId
    ) {
      return;
    }

    updateDesign((currentDesign) => {
      const activeIndex = currentDesign.sections[
        activeSectionId
      ]?.components.findIndex((c) => c.id === active.id);
      const overIndex = currentDesign.sections[
        overSectionId
      ]?.components.findIndex((c) => c.id === over?.id);

      if (activeIndex !== overIndex) {
        let newSections = { ...currentDesign.sections };

        // Move the active item within its section to the new position
        (newSections[overSectionId] as Section).components = arrayMove(
          (newSections[overSectionId] as Section).components,
          activeIndex as number,
          overIndex as number
        );

        return { ...currentDesign, sections: newSections };
      }

      return currentDesign; // If nothing changed, return the current design
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
      {Object.keys(design.sections).map((name) => (
        // @ts-ignore
        // eslint-disable-next-line
        // Wtf is this? todo
        <Section key={name} {...design.sections[name]} />
      ))}
      <Garbage components={deleted} />
    </DndContext>
  );
};
