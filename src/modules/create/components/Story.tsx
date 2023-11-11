import { type Story as StoryType } from "@prisma/client";
import { getRandomCompanyName } from "~/modules/create/utils";
import { Autoresize } from "../../../components/ui/inputs/components/Autoresize";

type StoryProps = {
  story: StoryType["story"];
  jobTitle: string;
  index: number;
};

const Ball = () => (
  <div className="absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
);

const Line = () => (
  <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
);

/**
 * Handles date of employment & company name.
 * @param {string} story - The story of employment.
 * @param {string} jobTitle - The job title of the user.
 * @param {number} index - The index of the story to generate the date of employment.
 */

export const Story = (props: StoryProps) => {
  const { story, jobTitle, index } = props;

  const companyName = getRandomCompanyName();

  /**
   * Create a random date of employment
   */
  const coefficient = index + 1;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - coefficient * 2;
  const endYear = startYear + 2 > currentYear ? currentYear : startYear + 2;
  const dateOfEmployment = `${startYear} - ${endYear}`;

  return (
    <div className="relative pb-4 first:mt-4">
      <Ball />
      <Line />
      <div className="ml-12 flex flex-col gap-1">
        <Autoresize
          className="w-full text-[1rem] font-bold"
          name={`dateOfEmployment-${index}`}
          value={dateOfEmployment}
          placeholder={dateOfEmployment}
        />
        <Autoresize
          className="w-full text-[1rem] font-bold"
          name={`companyName-${index}`}
          value={companyName!}
          placeholder={companyName}
        />
        <Autoresize
          className="w-full italic"
          name={`jobTitle-${index}`}
          value={jobTitle}
          placeholder={jobTitle}
        />
        <Autoresize
          value={story}
          name={`story-${story.substring(0, 15)}`}
          placeholder={story}
        />
      </div>
    </div>
  );
};
