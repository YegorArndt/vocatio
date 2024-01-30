import type { ContactEntry } from "@prisma/client";
import cn from "classnames";
import { forIn } from "lodash-es";
import { RouterUser } from "~/modules/extension/types";

export { cn };

export { api } from "./api";

export const getLinkedinId = (url: string): string => {
  const pattern = /linkedin\.com\/in\/([\w-]+)/;
  const match = url.match(pattern);

  if (match?.[1]) {
    return match[1];
  }

  return "";
};

export const getLinkedInUrlFromContact = (contact: ContactEntry) => {
  return forIn(contact, (v, k) => {
    if (k.toLowerCase() === "linkedin") {
      return v;
    }
  });
};

export const getMissingInfo = (user: RouterUser) => {
  const keys: (keyof RouterUser)[] = [
    "contact",
    "education",
    "experience",
    "languages",
    "skills",
    "professionalSummary",
  ];

  //@ts-ignore
  return keys.filter((key) => !user[key]?.length);
};
