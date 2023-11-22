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

import { Autoresize, type AutoresizeProps } from "./Autoresize";
import { Tooltip } from "react-tooltip";
import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { Button } from "~/components/ui/buttons/Button";
import { RiDragMove2Fill } from "react-icons/ri";
import { LuCopyPlus } from "react-icons/lu";
import { FcRightDown2 } from "react-icons/fc";

type ItemProps = {
  id: string;
  date: AutoresizeProps;
  place: AutoresizeProps;
  heading: AutoresizeProps;
  story: AutoresizeProps;
  className?: string;
};

type DecoratedTimelineProps = {
  value: ItemProps[];
  className?: string;
};

const SmChevron = () => <FcRightDown2 size={10} />;

const BlurButton = (
  props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
) => {
  const { className, children, ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsLoading(false), []);

  return (
    <button
      className={cn(
        "flex-center duration-700 ease-in-out group-hover:opacity-75",
        className,
        isLoading
          ? "scale-110 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0"
      )}
      {...rest}
    >
      {children}
    </button>
  );
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

export const Item = (props: ItemProps & { hasLine: boolean }) => {
  const { date, place, heading, story, hasLine, id } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative pl-8"
      data-tooltip-id={id}
    >
      <div className="absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
      {hasLine && (
        <div className="absolute left-[.36rem] top-2 h-[110%] w-[0.5px] bg-black" />
      )}
      <Autoresize className="text-[1rem] font-bold" {...date} />
      <Autoresize className="text-[1rem] font-bold" {...place} />
      <Autoresize className="italic" {...heading} />
      <Autoresize {...story} />
      <Tooltip
        id={id}
        place="top"
        opacity={1}
        offset={-50}
        style={{ paddingInline: 10, zIndex: 9999 }}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        clickable
        delayShow={400}
        delayHide={200}
        render={() => {
          return (
            <ul
              className="flex-center [&>li+li]:border-left w-full gap-3 rounded-md [&>li+li]:pl-3"
              data-html2canvas-ignore
            >
              <li {...listeners} {...attributes}>
                <Button className="sm navigation">
                  <RiDragMove2Fill />
                </Button>
              </li>
              <li>
                <Button className="sm navigation gap-2">
                  <LuCopyPlus /> <SmChevron />
                </Button>
              </li>
              <li>
                <BlurButton className="sm navigation gap-1 rounded-full">
                  ✨<SmChevron />
                </BlurButton>
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
    getItemsFromLs(vacancy.id) ?? setItemsToLs(vacancy.id, value)
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
          className={cn(
            "relative flex flex-col gap-5 pb-4 first:mt-4",
            className
          )}
          {...rest}
        >
          {items.map((item, i) => (
            <Item key={item.id} {...item} hasLine={i < items.length - 1} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
