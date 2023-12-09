import type { Vacancy, User } from "@prisma/client";
import type { ReactNode, RefObject } from "react";
import type { UserResource } from "@clerk/types";

import type { Design, RawDesign } from "./design";
import { type Defaults } from "../utils/getDefaults";

export type DraftContextInput = Pick<
  DraftContextOutput,
  "user" | "vacancy" | "defaultUserData" | "a4Ref"
> & {
  children: (a: DraftContextOutput) => ReactNode;
};

export type DraftContextOutput = {
  design: Design;
  a4Ref: RefObject<HTMLDivElement>;
  updateDesign: () => void;
  changeDesign: (d: RawDesign) => void;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
  defaults: Defaults;
};
