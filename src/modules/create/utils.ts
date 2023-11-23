import { Active, UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { SortableTransition } from "@dnd-kit/sortable/dist/hooks/types";

import { IT_COMPANY_NAMES } from "./constants";

export const getRandomCompanyName = () => {
  const randomIndex = Math.floor(Math.random() * IT_COMPANY_NAMES.length);
  return IT_COMPANY_NAMES[randomIndex] || "Google";
};

type AnimateLayoutChanges = {
  active: Active | null;
  containerId: UniqueIdentifier;
  isDragging: boolean;
  isSorting: boolean;
  id: UniqueIdentifier;
  index: number;
  items: UniqueIdentifier[];
  previousItems: UniqueIdentifier[];
  previousContainerId: UniqueIdentifier;
  newIndex: number;
  transition: SortableTransition | null;
  wasDragging: boolean;
};

export const animateLayoutChanges = (args: AnimateLayoutChanges) => {
  const { isSorting } = args;

  if (isSorting) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};
