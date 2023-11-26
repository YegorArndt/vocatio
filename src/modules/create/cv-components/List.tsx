import { useState, useMemo } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Autoresize, type AutoresizeProps } from "./Autoresize";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ComponentValue } from "~/modules/draft/types/components";
import cn from "classnames";
import { Tooltip } from "react-tooltip";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { Button } from "~/components/ui/buttons/Button";
import { LuCopyPlus } from "react-icons/lu";

export type ListProps = {
  value?: ComponentValue;
  items?: ListItemProps[];
  className?: string;
  id?: string;
};

type ListItemProps = AutoresizeProps;

const maxItemsPerContext = 7;

const defaultItems: AutoresizeProps[] = [
  { id: "1", value: "Item 1" },
  { id: "2", value: "Item 2" },
  { id: "3", value: "Item 3" },
];

const getInitial = (
  items: ListProps["items"],
  value: ComponentValue,
  id: string
) => {
  const initial: ListProps["items"] = [];
  const idPrefix = id.split("-")[0];

  if (!items?.length) {
    if (typeof value === "string") {
      const values = value.split(",");
      values.forEach((value, index) => {
        initial.push({
          id: `${idPrefix}-${index.toString()}`,
          value: value.trim(),
        });
      });

      return initial;
    }
  } else {
    return items;
  }

  return defaultItems;
};

const SortableItem = (
  props: ListItemProps & { addItem: () => void; deleteItem: () => void }
) => {
  const { id, addItem, deleteItem } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id! });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-[0.5em]"
      data-tooltip-id={id}
    >
      <div className="cursor-grab">&bull;</div>
      <Autoresize {...props} />
      <Tooltip
        id={id}
        place="top"
        opacity={1}
        style={{ paddingInline: 10, zIndex: 9999 }}
        clickable
        className="z-tooltip h-[30px] !p-0 [&>*]:h-full"
        delayShow={400}
        delayHide={600}
        render={() => {
          return (
            <ul
              className="flex-center [&>li+li]:border-left z-tooltip h-full w-full rounded-md clr-secondary [&_li]:h-full [&_li_button]:h-full [&_li_button]:px-3"
              data-html2canvas-ignore
            >
              <li {...listeners} {...attributes}>
                <Button baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition">
                  <RiDragMove2Fill />
                </Button>
              </li>
              <li>
                <Button
                  baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition"
                  onClick={addItem}
                >
                  <LuCopyPlus />
                </Button>
              </li>
              <li>
                <Button
                  onClick={deleteItem}
                  className="sm common hover:bg-red hover:text-[#fff]"
                >
                  <RiDeleteBin6Line />
                </Button>
              </li>
            </ul>
          );
        }}
      />
    </li>
  );
};

export const List = ({ items, value, className, id }: ListProps) => {
  const initialItems = getInitial(items, value, id!);
  const [currentItems, setItems] = useState(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const itemGroups = useMemo(() => {
    const groups = [];
    for (let i = 0; i < currentItems.length; i += maxItemsPerContext) {
      groups.push(currentItems.slice(i, i + maxItemsPerContext));
    }
    return groups;
  }, [currentItems]);

  const addItem = (index: number) => {
    setItems((currentItems) => {
      // Create a copy of the item at the specified index
      const newItem = { ...currentItems[index] };
      // Modify the id of the new item to make it unique
      newItem.id = `item-${new Date().getTime()}`;

      // Insert the new item below the clicked item
      const updatedItems = [...currentItems];
      updatedItems.splice(index + 1, 0, newItem);

      return updatedItems;
    });
  };

  const deleteItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {itemGroups.map((group, index) => (
          <SortableContext
            key={index}
            items={group.map((item) => item.id!)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-1">
              {group.map((item, i) => (
                <SortableItem
                  key={item.id}
                  addItem={() => addItem(i)}
                  deleteItem={() => deleteItem(item.id!)}
                  {...item}
                />
              ))}
            </ul>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};
