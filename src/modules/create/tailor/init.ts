import { Common } from "./types";
import { Cv, Gen } from "~/modules/init-gen/types";
import { PartialVacancy, RouterUser } from "~/modules/types";
import { uuidv4 } from "~/modules/utils";
import { CvContextManager } from "~/modules/CvContextManager";
import { snakeCase } from "lodash-es";
import { getSettings } from "~/modules/settings/settings";

const { log } = console;

const createInitialCv = <T extends Partial<Gen>>(user: RouterUser, gen: T) => {
  const { vacancy } = gen as { vacancy: PartialVacancy };
  const jobTitle = vacancy.jobTitle || user.jobTitle || "Software Developer";
  const settings = getSettings();

  const cv: Cv = {
    id: uuidv4(),
    vacancyId: vacancy.id,
    userName: user.name,
    jobTitle,

    /**
     * AI generated. Initially empty.
     */
    skills: [],
    summary: "",
    /**
     * Trigger loading state with empty array.
     */
    // @ts-ignore
    experience: user.experience.map((x) => {
      if (settings.modifiableItems.includes(x.id)) {
        return {
          ...x,
          bullets: [],
        };
      }
      return x;
    }),
    // @ts-ignore
    education: user.education,
    languages: user.languages,
    contact: user.contact,
    fileName: `${snakeCase(user.name)}_CV`, // Will be reset later in `FileName.tsx`
  };

  return cv;
};

export const init = (props: Common) => {
  const { vacancy } = props;

  const initialGen = {
    generatedExperience: [],
    generatedProfessionalSummary: "",
    generatedSkills: [],
    vacancy,
    vacancyResponsibilities: [],
    vacancySkills: [],
  } as unknown as Gen;

  const initialCv = createInitialCv<typeof initialGen>(props.user, initialGen);

  const instance = CvContextManager.getInstance();

  instance.setGen(initialGen);
  instance.setCv(initialCv);
};
