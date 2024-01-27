import type { ReactNode, RefObject } from "react";

import type { Design } from "./design";
import type { RawDesign } from "./raw";
import type { PartialVacancy } from "~/modules/extension/types";
import { generateDraft } from "~/server/api/utils/generate-cv";

export type LsDraft = Awaited<ReturnType<typeof generateDraft>> & {
  coverLetter?: string;
  vacancy: PartialVacancy;
};

export type DraftContextInput = Pick<DraftContextOutput, "draft" | "a4Ref"> & {
  children: (a: DraftContextOutput) => ReactNode;
};

export type DraftContextOutput = {
  design: Design;
  a4Ref: RefObject<HTMLDivElement>;
  updateDesign: (d?: Partial<Design>) => void;
  changeDesign: (d: RawDesign) => void;
  draft: LsDraft;
};
