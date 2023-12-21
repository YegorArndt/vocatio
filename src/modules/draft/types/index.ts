import type { Vacancy } from "@prisma/client";
import type { ReactNode, RefObject } from "react";
import type { UserResource } from "@clerk/types";

import type { Design, RawDesign } from "./design";
import { type Defaults } from "../utils/getDefaults";
import { RouterOutputs } from "~/utils/api";

export type DraftContextInput = Pick<
  DraftContextOutput,
  "user" | "vacancy" | "defaultUserData" | "a4Ref"
> & {
  children: (a: DraftContextOutput) => ReactNode;
};

export type DraftContextOutput = {
  design: Design;
  a4Ref: RefObject<HTMLDivElement>;
  updateDesign: (d?: Partial<Design>) => void;
  persistToLs: (d: Design) => void;
  changeDesign: (d: RawDesign) => void;
  user: RouterOutputs["users"]["get"];
  vacancy: Vacancy;
  defaultUserData: UserResource;
  defaults: Defaults;
};
