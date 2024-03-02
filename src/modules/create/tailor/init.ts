import { Common } from "./types";
import { Cv, Gen } from "~/modules/init-gen/types";
import { PartialVacancy, RouterUser } from "~/modules/types";
import { uuidv4 } from "~/modules/utils";
import { bulletizeDescriptions } from "./tailorExperience";
import { CvContextManager } from "~/modules/CvContextManager";
import { snakeCase } from "lodash-es";
import { getSettings } from "~/modules/settings/settings";

const { log } = console;

const createInitialCv = <T extends Partial<Gen>>(user: RouterUser, gen: T) => {
  const { vacancy } = gen as { vacancy: PartialVacancy };

  const jobTitle = vacancy.jobTitle || user.jobTitle || "Software Developer";
  const experience = bulletizeDescriptions(user, "experience");

  /**
   * With 0 bullets, loading state will be initially shown.
   */
  const settings = getSettings();
  settings.modifiableItems.forEach((id) => {
    const entry = experience.find((e) => e.id === id);
    if (entry) entry.bullets = [];
  });

  const education = bulletizeDescriptions(user, "education");

  const cv: Cv = {
    id: uuidv4(),
    vacancyId: vacancy.id,
    userName: user.name,
    jobTitle,

    /**
     * AI generated. Initially empty to show loading state.
     */
    skills: [],
    summary: "",
    experience,
    /** */

    education,
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
