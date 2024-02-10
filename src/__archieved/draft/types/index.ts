import type { ReactNode, RefObject } from "react";

import type { Design } from "./design";
import type { RawDesign } from "./raw";

export type AiGenerated = {
  vacancySkills: string[];
  vacancyResponsibilities: string[];
  professionalSummary: string;
  integratedGenericBulletPoints: string[];
  matchingSkills: string[];
  bonusTasks: {
    "0": {
      tuples: [string, string][];
      mergedTuples: string[];
    };
  };
};

export type DraftContextInput = Pick<DraftContextOutput, "draft" | "a4Ref"> & {
  children: (a: DraftContextOutput) => ReactNode;
};

export type DraftContextOutput = {
  design: Design;
  a4Ref: RefObject<HTMLDivElement>;
  updateDesign: (d?: Partial<Design>) => void;
  changeDesign: (d: RawDesign) => void;
  draft: GeneratedDraft;
};
