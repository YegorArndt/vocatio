import { useEffect, useState } from "react";
import cn from "classnames";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { LuCopyPlus } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { TfiWrite } from "react-icons/tfi";
import { BsArrowsCollapse } from "react-icons/bs";
import { SlMagicWand } from "react-icons/sl";

import { Autoresize, type AutoresizeProps } from "./Autoresize";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { Button } from "~/components/ui/buttons/Button";
import type { ComponentValue } from "~/modules/draft/types/components";
import { api } from "~/utils";
import { BlurImage } from "~/components/BlurImage";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

type ItemProps = {
  id: string;
  date: AutoresizeProps;
  place: AutoresizeProps;
  heading: AutoresizeProps;
  story: AutoresizeProps;
  className?: string;
};

type DecoratedTimelineProps = {
  value: ComponentValue;
  className?: string;
};

const getConsequentDate = (index: number) => {
  const coefficient = index + 1;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - coefficient * 2;
  const endYear = startYear + 2 > currentYear ? currentYear : startYear + 2;
  return `${startYear} - ${endYear}`;
};

const setItemsToLs = (vacancyId: string, items: ItemProps[]) => {
  items.forEach((i) => {
    const key = `${vacancyId}-${i.id}`;
    const value = JSON.stringify(i);
    localStorage.setItem(key, value);
  });

  return items;
};

const getItemsFromLs = (vacancyId: string) => {
  const items = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key?.startsWith(vacancyId)) continue;

    const value = localStorage.getItem(key);

    if (!value) continue;

    items.push(JSON.parse(value));
  }

  return items.length ? items : null;
};

export const Item = (
  props: ItemProps & {
    isLast: boolean;
    addItem: () => void;
    deleteItem: () => void;
  }
) => {
  const { date, place, heading, story, isLast, id, addItem, deleteItem } =
    props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex flex-col gap-1 pl-8"
      data-tooltip-id={id}
    >
      {/* Dot  */}
      <div
        className={cn(
          "absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white"
        )}
      />
      {/* Line  */}
      {isLast && (
        <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
      )}
      <Autoresize className="text-[1rem] font-bold" {...date} />
      <div className="flex gap-2">
        <BlurImage
          src="https://media.licdn.com/dms/image/C560BAQFrtK-ioO1rsQ/company-logo_100_100/0/1630645864762/adobe_logo?e=1708560000&v=beta&t=QGe5TIVH_RPfn3r7zZmNUCjeKSF0MqC4B10NaRTSk0k"
          width={20}
          height={20}
          alt="e"
        />
        <Autoresize className="text-[1rem] font-bold" {...place} />
      </div>
      <Autoresize className="italic" {...heading} />
      <Autoresize className="text-[14px]" {...story} />
      <Tooltip
        id={id}
        place="top"
        opacity={1}
        offset={-50}
        style={{ paddingInline: 10, zIndex: 9999 }}
        clickable
        className="h-[40px] !p-0 [&>*]:h-full"
        delayShow={400}
        delayHide={600}
        render={() => {
          return (
            <ul
              className="flex-center [&>li+li]:border-left h-full w-full rounded-md clr-secondary [&_li]:h-full [&_li_button]:h-full [&_li_button]:px-3"
              data-html2canvas-ignore
            >
              <li {...listeners} {...attributes}>
                <Button baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition">
                  Move item <RiDragMove2Fill />
                </Button>
              </li>
              <li>
                <Button
                  baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition"
                  onClick={addItem}
                >
                  Duplicate item <LuCopyPlus />
                </Button>
              </li>
              <li>
                <Menu
                  menuButton={
                    <MenuButton className="hover  flex-center hover:text-[#fff]">
                      <BlurImage
                        src="/gpt-logo.jpg"
                        height={30}
                        width={30}
                        alt="logo"
                      />
                    </MenuButton>
                  }
                  transition
                  gap={5}
                >
                  <MenuItem className="flex items-center gap-2">
                    <SlMagicWand />
                    Adjust to vacancy
                  </MenuItem>
                  <MenuItem className="flex items-center gap-2">
                    <BsArrowsCollapse />
                    Condense
                  </MenuItem>
                  <MenuItem className="flex items-center gap-2">
                    <TfiWrite />
                    Rewrite
                  </MenuItem>
                </Menu>
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

export const DecoratedTimeline = (props: DecoratedTimelineProps) => {
  const { value, className, ...rest } = props;
  const { vacancy } = useDraftContext();

  const [items, setItems] = useState<ItemProps[]>(
    getItemsFromLs(vacancy.id) ?? setItemsToLs(vacancy.id, value as ItemProps[])
  );

  const sensors = useSensors(useSensor(PointerSensor));

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

  const { mutate, data, isLoading } = api.gpt.getCompletion.useMutation();

  const addItem = (index: number) => {
    setItems((currentItems) => {
      // Create a copy of the item at the specified index
      const newItem = { ...currentItems[index] };
      // Modify the id of the new item to make it unique
      newItem.id = `item-${new Date().getTime()}`;

      // Insert the new item below the clicked item
      const updatedItems = [...currentItems];
      updatedItems.splice(index + 1, 0, newItem as ItemProps);

      return updatedItems;
    });
  };

  const deleteItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  useEffect(() => {
    if (!data) return;

    const { story, companyName } = data;
    const index = items.length;

    setItems((prev) => [
      ...prev,
      {
        id: `item-${index}`,
        story: {
          id: `story-${index}`,
          value: story.content,
        },
        date: {
          id: `date-${index}`,
          value: getConsequentDate(index),
        },
        place: {
          id: `place-${index}`,
          value: companyName,
        },
        heading: {
          id: `heading-${index}`,
          value: vacancy.jobTitle,
        },
      },
    ]);
  }, [data]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn("relative flex flex-col [&>*]:pb-4", className)}
          {...rest}
        >
          {items.map((item, i) => (
            <Item
              key={item.id}
              {...item}
              isLast={i < items.length - 1}
              addItem={() => addItem(i)}
              deleteItem={() => deleteItem(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
