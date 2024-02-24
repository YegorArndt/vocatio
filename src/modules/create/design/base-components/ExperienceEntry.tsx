import { useLs } from "~/hooks/useLs";
import { useComponentContext } from "../contexts/ComponentContext";
import {
  DndProvider,
  DndProviderProps,
  ImperativeHandleRef,
} from "./dnd/DndProvider";
import { useEffect, useRef } from "react";
import {
  AddBulletPoint,
  ComponentAdditionDetail,
  ComponentRemovalDetail,
  EventHandler,
  Events,
  ExperienceGeneratedDetail,
  eventManager,
} from "~/modules/EventManager";
import { Items, LocalStorageManager } from "~/modules/LocalStorageManager";
import { uuidv4 } from "~/modules/utils";

const { log } = console;

type EventHandlers = {
  onLoad: () => void;
  onGenerated: EventHandler<ExperienceGeneratedDetail>;
  onAddBullet: EventHandler<AddBulletPoint>;
  onAddComponent: EventHandler<ComponentAdditionDetail>;
  onRemoveComponent: EventHandler<ComponentRemovalDetail>;
};

type ExperienceEntry = ExperienceGeneratedDetail[number];

const useEvents = (props: EventHandlers) => {
  const {
    onLoad,
    onGenerated,
    onAddBullet,
    onRemoveComponent,
    onAddComponent,
  } = props;

  const entry = useComponentContext();
  const { ls } = useLs();

  useEffect(() => {
    const isLoaded = !!ls.modifiableItems.length;
    if (!isLoaded) return;

    const isAlreadyGenerated = LocalStorageManager.getInstance().getItem(
      Items.EXPERIENCE_ENTRY,
      entry.id
    );

    if (ls.modifiableItems.includes(entry.id) && !isAlreadyGenerated) {
      eventManager.on<ExperienceGeneratedDetail>(
        Events.EXPERIENCE_GENERATED_EVENT,
        onGenerated
      );
    } else {
      onLoad();
    }

    eventManager.on<AddBulletPoint>(
      Events.ADD_BULLET_TO_ENTRY_EVENT,
      onAddBullet
    );
  }, [ls]);

  useEffect(() => {
    eventManager.on<ComponentAdditionDetail>(
      Events.COMPONENT_ADDED_EVENT,
      onAddComponent
    );

    eventManager.on<ComponentRemovalDetail>(
      Events.COMPONENT_REMOVED_EVENT,
      onRemoveComponent
    );

    return () => {
      eventManager.off(Events.COMPONENT_ADDED_EVENT, onAddComponent);
      eventManager.off(Events.COMPONENT_REMOVED_EVENT, onRemoveComponent);
    };
  }, []);
};

export const ExperienceEntry = () => {
  const c = useComponentContext();

  const imperative = useRef<ImperativeHandleRef | null>(null);

  const setter = (entry?: ExperienceEntry) => {
    if (!imperative.current) return;

    imperative.current.updateSections(() => {
      // @ts-ignore
      const { sections } = c.hydratableProps!(entry);
      return sections;
    });
  };

  useEvents({
    onGenerated: (e) => {
      const generatedEntry = e.detail.find((e) => e.id === c.id);
      if (!generatedEntry) return;

      setter(generatedEntry);
      LocalStorageManager.getInstance().setItem(
        Items.EXPERIENCE_ENTRY,
        // @ts-ignore
        c.hydratableProps!(generatedEntry),
        generatedEntry.id
      );
    },
    onLoad: () => {
      const entry = LocalStorageManager.getInstance().getItem<DndProviderProps>(
        Items.EXPERIENCE_ENTRY,
        c.id
      );

      if (entry) {
        imperative.current?.updateSections(() => entry.sections);
        return;
      }

      setter();

      LocalStorageManager.getInstance().setItem(
        Items.EXPERIENCE_ENTRY,
        // @ts-ignore
        c.hydratableProps!(),
        c.id
      );
    },
    onAddBullet: (e) => {
      if (e.detail.entry.id !== c.id) return;
      const bulletPoint = createNewBulletPoint(e.detail.bullet, e.detail.entry);

      // @ts-ignore
      imperative.current?.updateSections((prev) => {
        const { components } = prev[e.detail.entry.id] || {};
        if (!components) return prev;

        const newComponents = [...components, bulletPoint];

        LocalStorageManager.getInstance().setItem(
          Items.EXPERIENCE_ENTRY,
          { sections: { [e.detail.entry.id]: { components: newComponents } } },
          e.detail.entry.id
        );

        return {
          ...prev,
          [e.detail.entry.id]: {
            ...prev[e.detail.entry.id],
            components: newComponents,
          },
        };
      });
    },
    onRemoveComponent: (e) => {
      if (e.detail.component.sectionId !== c.id) return;
      const { newSections } = e.detail;

      LocalStorageManager.getInstance().setItem(
        Items.EXPERIENCE_ENTRY,
        { sections: newSections },
        c.id
      );
    },
    onAddComponent: (e) => {
      if (e.detail.component.sectionId !== c.id) return;

      const { newSections } = e.detail;

      LocalStorageManager.getInstance().setItem(
        Items.EXPERIENCE_ENTRY,
        { sections: newSections },
        c.id
      );

      imperative.current?.updateSections(() => newSections);
    },
  });

  return <DndProvider ref={imperative} sections={{}} />;
};

const createNewBulletPoint = (bullet: string, entry: ExperienceEntry) => {
  const lsEntry = LocalStorageManager.getInstance().getItem<DndProviderProps>(
    Items.EXPERIENCE_ENTRY,
    entry.id
  );

  if (!lsEntry?.sections?.[entry.id]?.components) return;

  const bulletComponent = lsEntry.sections![entry.id]!.components.find((c) =>
    c.id.includes("bullet")
  );

  if (!bulletComponent) return;

  const hydratedProps = {
    ...bulletComponent.hydratedProps,
    value: bullet.replace("•", ""),
  };

  const newBulletComponent = {
    ...bulletComponent,
    id: uuidv4() + "-bullet",
    hydratedProps,
  };

  return newBulletComponent;
};
