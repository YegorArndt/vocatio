import { type Story as StoryType } from "@prisma/client";
import { getRandomCompanyName } from "~/modules/create/utils";
import { Input } from "../../../components/ui/inputs/components/Input";
import { Autoresize } from "../../../components/ui/inputs/components/Autoresize";

type StoryProps = {
  story: StoryType["story"];
  jobTitle: string;
  index: number;
};

const Ball = () => (
  <div className="absolute left-0 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
);

const Line = () => (
  <div className="absolute left-[.36rem] h-full w-[0.5px] bg-black" />
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
    <div className="relative mb-8">
      <Ball />
      <Line />
      <div className="ml-12 flex flex-col gap-1">
        <h4>
          <Input
            name={`dateOfEmployment-${index}`}
            value={dateOfEmployment}
            placeholder={dateOfEmployment}
            className="w-full text-[1rem] font-bold"
          />
        </h4>
        <Input
          name={`companyName-${index}`}
          value={companyName}
          placeholder={companyName}
          className="w-full text-[1rem] font-bold"
        />
        <Input
          value={jobTitle}
          placeholder={jobTitle}
          name={`jobTitle-${index}`}
          className="w-full italic"
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
