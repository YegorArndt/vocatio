import {
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCenter,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { startCase } from "lodash-es";
import { useState } from "react";
import { TbRestore } from "react-icons/tb";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { Layout } from "~/components/layout/Layout";
import { Button } from "~/components/ui/buttons/Button";
import { typedKeys } from "~/modules/draft/utils/common";
import { preferencesToolbar } from "~/modules/preferences/constants";

type SectionIds = "adjust completely" | "adjust slightly" | "do not adjust";

type Item = {
  id: string;
  sectionId: SectionIds;
  label: string;
};

const subtitles = {
  "adjust completely":
    "Tailor it to the vacancy requirements replacing my own data:",
  "adjust slightly":
    "Essentially use my own data, but highlight what's relevant for the vacancy requirements:",
  "do not adjust": "Use only my own data for:",
};

const recommended = {
  "adjust completely": ["job title"],
  "adjust slightly": ["employment history", "objective", "education", "skills"],
  "do not adjust": ["location", "languages"],
};

const SortableItem = ({ id, label }) => {
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
    width: "100%",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {label}
    </div>
  );
};

const Section = ({ id, items }: { id: SectionIds; items: Item[] }) => {
  const { setNodeRef } = useDroppable({ id });

  // Style to ensure the section has a minimum height

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <section
        ref={setNodeRef}
        className="flex flex-col gap-2 rounded-md border p-5"
      >
        <div>
          <h3>{startCase(id)}</h3>
          <p className="clr-disabled">{subtitles[id]}</p>
        </div>
        {items.length > 0 &&
          items.map((props) => <SortableItem key={props.id} {...props} />)}

        {items.length === 0 && (
          <div className="clr-disabled">
            Recommended:
            <ul>
              {recommended[id].map((item) => (
                <li className="first-letter:capitalize" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </SortableContext>
  );
};

const initialContainers = {
  "adjust completely": [
    { id: "job-title", sectionId: "adjust completely", label: "Job title" },
  ],
  "adjust slightly": [
    {
      id: "employment-history",
      sectionId: "adjust slightly",
      label: "Employment History",
    },
    {
      id: "objective",
      sectionId: "adjust slightly",
      label: "Objective",
    },
    {
      id: "education",
      sectionId: "adjust slightly",
      label: "Education",
    },
    {
      id: "skills",
      sectionId: "adjust slightly",
      label: "Skills",
    },
  ],
  "do not adjust": [
    {
      id: "location",
      sectionId: "do not adjust",
      label: "Location",
    },
    {
      id: "languages",
      sectionId: "do not adjust",
      label: "Languages",
    },
  ],
};

const CustomizePage = () => {
  const [activeId, setActiveId] = useState<null | string>(null);

  const [containers, setContainers] = useState(initialContainers);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (itemId) => {
    return Object.keys(containers).find((containerId) =>
      containers[containerId].some((item) => item.id === itemId)
    );
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragOver = ({ active, over }) => {
    if (over) {
      const overContainerId = findContainer(over.id);
      const activeContainerId = findContainer(active.id);

      if (overContainerId && activeContainerId) {
        setContainers((prev) => {
          // Clone the current state
          const newState = { ...prev };

          // Remove the active item from its original container
          const activeItems = newState[activeContainerId].filter(
            (item) => item.id !== active.id
          );

          if (overContainerId === activeContainerId) {
            // Handle reordering within the same container
            const overIndex = newState[overContainerId].findIndex(
              (item) => item.id === over.id
            );
            activeItems.splice(
              overIndex,
              0,
              prev[activeContainerId].find((item) => item.id === active.id)
            );
            newState[activeContainerId] = activeItems;
          } else {
            // Handle moving to a different container
            newState[overContainerId] = [
              ...newState[overContainerId],
              prev[activeContainerId].find((item) => item.id === active.id),
            ];
            newState[activeContainerId] = activeItems;
          }

          return newState;
        });
      }
    }
  };

  const handleDragEnd = ({ active, over }) => {
    // Logic to handle drag end, finalize item positions
  };

  return (
    <Layout toolbar={preferencesToolbar}>
      <section className="content">
        <h1>Customize how Vocatio makes adjustments.</h1>
        <p>
          Drag and drop the items between the sections to customize the
          adjustments.
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-8">
            {typedKeys(containers).map((containerId) => (
              <Section
                key={containerId}
                id={containerId}
                items={containers[containerId]}
              />
            ))}
          </div>
        </DndContext>
        <footer className="flex-y gap-5 py-8">
          <Button
            frontIcon={<IoIosCheckmarkCircleOutline />}
            text="Save"
            className="primary sm min-w-[150px]"
          />
          <Button
            frontIcon={<TbRestore />}
            text="Restore defaults"
            className="primary sm min-w-[150px]"
          />
        </footer>
      </section>
    </Layout>
  );
};
export default CustomizePage;
