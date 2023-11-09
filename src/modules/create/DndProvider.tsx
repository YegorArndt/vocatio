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

import { ComponentFactory } from "./ComponentFactory";
import {
  type DraftComponent,
  type Sections,
  useDraftContext,
} from "../draft/DraftContext";
import { EditorTooltip } from "./components/editor-tooltip";

type SectionProps = {
  id: string;
  order: number;
  components: DraftComponent[];
  className: string;
};

export const getSectionIdByComponentId = (
  sections: Sections,
  componentId: string
) => {
  if (componentId in sections) return componentId;

  const sectionId = Object.keys(sections).find((name) => {
    const section = sections[name];

    if (!section) return null;

    return section.components.find((c) => c.id === componentId);
  });

  return sectionId;
};

const SortableItem = (
  props: PropsWithChildren<{ component: DraftComponent }>
) => {
  const { component: c, children } = props;
  const {
    draftState: { REARRANGING_FIRED },
  } = useDraftContext();

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

const Section = (props: SectionProps) => {
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
      newSections[activeSectionId].components = activeItems.filter(
        (item) => item.id !== active.id
      );

      // Insert the active item into the new section at the correct position
      newSections[overSectionId].components = [
        ...overItems.slice(0, overIndex),
        activeItems[activeIndex],
        ...overItems.slice(overIndex),
      ];

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
        newSections[overSectionId].components = arrayMove(
          newSections[overSectionId].components,
          activeIndex,
          overIndex
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
        <Section key={name} {...design.sections[name]} />
      ))}
    </DndContext>
  );
};