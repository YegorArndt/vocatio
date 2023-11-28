import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { PropsWithChildren, useState } from "react";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import cn from "classnames";
import { startCase } from "lodash-es";

import { typedKeys } from "~/modules/draft/utils/common";
import { Button } from "~/components/ui/buttons/Button";
import { api } from "~/utils";
import { Layout } from "~/components/layout/Layout";
import { Text } from "~/components/ui/inputs/Text";
import { FormContext } from "~/modules/preferences/FormContext";
import {
  flattenObject,
  isDraggable,
  isNested,
} from "~/modules/preferences/utils";
import { preferencesToolbar } from "~/modules/preferences/constants";

type Item = PropsWithChildren<{
  label: string;
  name: string;
  id: string;
  className?: string;
}>;

const SortableItem = (props: Item) => {
  const { label, id, children, className } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable(id) });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <label
        htmlFor={id}
        className={cn({
          "cursor-grab": isDraggable(id),
        })}
        {...attributes}
        {...listeners}
      >
        {startCase(label)}
      </label>
      <div> {children}</div>
    </div>
  );
};

const DndProvider = (props: { items: Item[] }) => {
  const { items: initialItems } = props;
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {items?.length > 0 && (
        <SortableContext
          items={items?.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items?.map((props) => (
            <SortableItem key={props.id} {...props} />
          ))}
        </SortableContext>
      )}
    </DndContext>
  );
};

export const Preferences = () => {
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();
  const userName = defaultUserData.user?.fullName;

  const userData = {
    main: {
      name: userName,
      jobTitle: user?.ownJobTitle || "-",
      professionField: user?.ownProfessionField || "Frontend Developer",
    },
    languages: { english: "C1", german: "C1", russian: "Native" },
    skills: {
      "Teamwork & Leadership": "4",
      "Communication & Presentation": "4",
      "Problem Solving & Creativity": "4",
      "Time Management & Organization": "4",
    },
    contact: {
      email: defaultUserData.user?.emailAddresses[0]?.emailAddress,
      phone: "+7 999 999 99 99",
      country: user?.ownCountry || "-",
      city: user?.ownCity || "-",
      location: "-",
    },
    education: {
      "University of Oxford": {
        degree: "Master of Science",
        field: "Computer Science",
        start: "2019",
        end: "2021",
      },
    },
  };

  const defaultValues = flattenObject(userData);

  return (
    <>
      <Head>
        <title>Preferences - Vocatio</title>
        <meta
          name="description"
          content="Tailor the best available CV builder to your needs."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        <section className="two-col-grid">
          <div className="main-center">
            <h1>Tailor the best available CV builder to your needs.</h1>
            <p>
              This is the data that Vocatio will use or fallback to when
              generating your CVs. <br />
              Did we get it right? ✨
            </p>
            {userName && (
              <FormContext form={{ defaultValues }}>
                {({ control, formState }) => {
                  return (
                    <form className="flex flex-col gap-8">
                      {Object.entries(userData).map(([title, entry]) => (
                        <section
                          key={title}
                          className="flex flex-col gap-8 rounded-md border bg-card pt-6 [&>*]:px-6"
                        >
                          <h4 className="first-letter:capitalize">{title}</h4>
                          <div className="flex flex-col gap-3">
                            <DndProvider
                              items={
                                isNested(title)
                                  ? typedKeys(entry).map((nestedTitle) => ({
                                      id: `${title}.${nestedTitle}`,
                                      label: nestedTitle,
                                      className: "grid grid-cols-2 gap-5",
                                      children: (
                                        <DndProvider
                                          items={Object.keys(
                                            entry[nestedTitle]
                                          ).map((nestedField) => ({
                                            id: `${title}.${nestedTitle}.${nestedField}`,
                                            label: nestedField,
                                            name: `${title}.${nestedTitle}.${nestedField}`,
                                            className:
                                              "grid grid-cols-2 gap-3 items-center",
                                            children: (
                                              <Text
                                                name={`${title}.${nestedTitle}.${nestedField}`}
                                                control={control}
                                                placeholder={
                                                  defaultValues[
                                                    `${title}.${nestedTitle}.${nestedField}`
                                                  ]
                                                }
                                              />
                                            ),
                                          }))}
                                        />
                                      ),
                                    }))
                                  : Object.keys(entry).map((field) => ({
                                      id: `${title}.${field}`,
                                      label: field,
                                      children: (
                                        <Text
                                          name={`${title}.${field}`}
                                          control={control}
                                        />
                                      ),
                                      className: "grid grid-cols-2",
                                    }))
                              }
                            />
                          </div>
                          <footer className="border-top flex-between w-full py-4">
                            {isDraggable(title) && (
                              <span className="w-1/2 clr-disabled">
                                You can control in what order the fields will be
                                displayed in your CV by dragging them here.
                              </span>
                            )}
                            <Button
                              text="Save"
                              disabled={!formState.dirtyFields[title]}
                              className="primary sm ml-auto w-1/5"
                            />
                          </footer>
                        </section>
                      ))}
                    </form>
                  );
                }}
              </FormContext>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Preferences;
