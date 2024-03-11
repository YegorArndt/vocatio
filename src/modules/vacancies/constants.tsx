import { get } from "lodash-es";

export const getDefaultIcon = (text: string | null) =>
  get(defaultGroups, `${text}.icon`, <>📁</>);

export const defaultGroups = {
  favorite: {
    icon: <span>😻</span>,
    label: "favorite",
  },
  applied: {
    icon: <span>✅</span>,
    label: "applied",
  },
  interview: {
    icon: <span>🎥</span>,
    label: "interview",
  },
  rejected: {
    icon: <span>😿</span>,
    label: "rejected",
  },
  offer: {
    icon: <span>🎉</span>,
    label: "offer",
  },
};
