import { Fragment, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDragMove2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { LuCopyPlus } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import cn from "classnames";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/buttons/Button";
import { NormalizedComponent } from "~/modules/draft/types/components";
import { ComponentContext } from "../ComponentContext";
import { ComponentFactory } from "../ComponentFactory";

export type ListProps = {
  id: string;
  items: NormalizedComponent[];
  hasDot?: boolean;
  title?: NormalizedComponent;
  footer?: NormalizedComponent;
  className?: string;
};

type ListItemProps = NormalizedComponent & {
  addItem: () => void;
  deleteItem: () => void;
};

const SortableItem = (props: ListItemProps) => {
  const { addItem, deleteItem, ...c } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} data-tooltip-id={c.id}>
      <ComponentContext.Provider value={c}>
        <ComponentFactory />
      </ComponentContext.Provider>
      <Tooltip
        id={c.id}
        // Covered by container tooltip when first element hovered TODO
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
    </div>
  );
};

export const List = (props: ListProps) => {
  const { hasDot, items: initialItems, title, footer, className } = props;
  const { data: user } = api.users.get.useQuery();
  const [items, setItems] = useState(initialItems);

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
      <section>
        {title && (
          <ComponentContext.Provider value={title}>
            <ComponentFactory />
          </ComponentContext.Provider>
        )}
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              "relative",
              {
                "pl-8": hasDot,
              },
              className
            )}
          >
            {items.map((item, i) => (
              <Fragment key={item.id}>
                <SortableItem
                  addItem={() => addItem(i)}
                  deleteItem={() => deleteItem(item.id!)}
                  {...item}
                />
                {hasDot && (
                  <>
                    <div className="z-1 absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
                    {i !== items.length && (
                      <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>
          {footer && (
            <ComponentContext.Provider value={footer}>
              <ComponentFactory />
            </ComponentContext.Provider>
          )}
        </SortableContext>
      </section>
    </DndContext>
  );
};
