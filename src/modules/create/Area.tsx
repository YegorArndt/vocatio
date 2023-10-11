import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from "react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cn from "classnames";
import type { Area as DbArea } from "@prisma/client";
import { ComponentFactory } from "./ComponentFactory";
import { useDraftContext } from "../draft/DraftProvider";
import { DraftComponent } from "../draft/types";

const onDragEnd = (
  event: DragEndEvent,
  setComponents: Dispatch<SetStateAction<DraftComponent[]>>
) => {
  const { active, over } = event;
  if (over && active?.id !== over?.id) {
    setComponents((components: DraftComponent[]) => {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      const newComponents = [...components].map((c) => {
        if (c.id === active.id) return { ...c, index: newIndex + 1 };

        if (c.id === over.id) return { ...c, index: oldIndex + 1 };

        return c;
      });

      return arrayMove(newComponents, oldIndex, newIndex);
    });
  }
};

const SortableItem = (
  props: PropsWithChildren<{ component: DraftComponent }>
) => {
  const { component: c, children } = props;

  const {
    state: { isRearranging },
  } = useDraftContext();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: c.id, data: c, disabled: !isRearranging });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
    marginBottom: "4px",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

type AreaProps = {
  className?: string;
  components: DraftComponent[];
} & DbArea;

/**
 * Area represents a CV zone within which components can be interacted with.
 * eg. left half of the CV.
 */
export const Area = (props: AreaProps) => {
  const { id, className, components: initialComponents } = props;
  const [components, setComponents] = useState(initialComponents);

  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <section ref={setNodeRef} className={cn(className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => onDragEnd(e, setComponents)}
      >
        <SortableContext
          items={components}
          strategy={verticalListSortingStrategy}
        >
          {components.map((c) => (
            <SortableItem key={c.name} component={c}>
              <ComponentFactory component={c} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
};
