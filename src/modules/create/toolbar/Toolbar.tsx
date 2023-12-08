import { RefObject, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";

import { BlurImage } from "~/components/BlurImage";
import { Button } from "~/components/ui/buttons/Button";
import { downloadPdf } from "../utils";
import { useDraftContext } from "../../draft/DraftContext";
import { Bin } from "../../bin";
import { BsArrowsCollapse } from "react-icons/bs";
import { FaTextHeight } from "react-icons/fa6";
import { Divider } from "~/components/layout/Divider";
import { Chip } from "~/components";
import {
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { isHeading } from "~/modules/draft/utils/common";
import cn from "classnames";
import { NormalizedComponent } from "~/modules/draft/types/components";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

const SortableItem = ({ component }: { component: NormalizedComponent }) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: component.id });

  const { design } = useDraftContext();

  const bgColor = design.sections["top-left"]?.className
    .split(" ")
    .find((i) => i.includes("bg-"));
  const textColor = design.sections.left?.className
    .split(" ")
    .find((i) => i.includes("text-[#"));

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn("rounded-lg p-2", bgColor, textColor)}
    >
      {component.props.value}
    </div>
  );
};

const SortableSection = ({ items }: { items: NormalizedComponent[] }) => {
  const [components, setComponents] = useState(items);
  const { rotate } = useDraftContext();

  useEffect(() => {
    setComponents(items);
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((comp) => comp.id === active.id);
      const newIndex = components.findIndex((comp) => comp.id === over.id);

      // Perform the rotation logic
      if (oldIndex !== -1 && newIndex !== -1) {
        const movedComponent = components[oldIndex];
        rotate(movedComponent!, newIndex);
        setComponents((currentComponents) =>
          arrayMove(currentComponents, oldIndex, newIndex)
        );
      }
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-2">
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {components.map((component) => (
            <SortableItem key={component.id} component={component} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export const Toolbar = (props: ToolbarProps) => {
  const { a4Ref } = props;
  const { user, vacancy, design } = useDraftContext();
  const headings = design.sections?.left?.components.filter((c) =>
    isHeading(c.type)
  );

  return (
    <>
      <Button
        text="Download PDF"
        frontIcon={
          <BlurImage
            src="/download-cloud.png"
            alt="Download"
            height={15}
            width={15}
          />
        }
        onClick={() => void downloadPdf(a4Ref, user.name, vacancy.companyName)}
        className="common hover flex-y gap-1"
      />
      <Bin />
      <Button
        frontIcon={<BsArrowsCollapse />}
        text="Condense spacing"
        className="common hover flex-y gap-1"
      />
      <Button
        frontIcon={<FaTextHeight />}
        text="Condense text"
        className="common hover flex-y gap-1"
      />
      <Divider />
      {headings && headings.length > 0 && (
        <>
          <span className="flex gap-2">
            Rearrange layout <Chip className="bg-sky sm clr-white">Beta</Chip>
          </span>
          <SortableSection items={headings || []} />
        </>
      )}
    </>
  );
};
