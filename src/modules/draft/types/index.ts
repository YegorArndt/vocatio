import type { ReactNode, RefObject } from "react";

import type { Design, RawDesign } from "./design";
import { generateDraft } from "~/server/api/utils/draft";

export type LsDraft = Awaited<ReturnType<typeof generateDraft>> & {
  coverLetter?: string;
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
