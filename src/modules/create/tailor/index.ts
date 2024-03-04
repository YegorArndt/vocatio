import { finish } from "./finish";
import { init } from "./init";
import { tailorExperience } from "./tailorExperience";
import { tailorSkills } from "./tailorSkills";
import { Common } from "./types";

export const tailor = async (props: Common) => {
  init(props);

  const [skills, experience] = await Promise.all([
    tailorSkills(props),
    tailorExperience(props),
  ]);

  const updatedGen = finish({
    ...skills,
    ...experience,
    user: props.user,
  });

  return updatedGen;
};
