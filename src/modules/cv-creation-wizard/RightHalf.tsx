import { getRandomCompanyName } from "./utils";
import { BaseInput } from "~/components/ui/inputs/components/BaseInput";
import { useStories } from "./useStories";
import { Textarea } from "~/components/ui";
import { useDraftContext } from "../draft/DraftProvider";
import type { Story } from "@prisma/client";
import { memo } from "react";

type TimelineProps = {
  story: Story["story"];
  jobTitle: string;
  index: number;
};

/**
 * Handles date of employment & company name.
 * @param {string} story - The story of the user.
 * @param {string} jobTitle - The job title of the user.
 * @param {number} index - The index of the story to generate the date of employment.
 */
const Timeline = memo((props: TimelineProps) => {
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
      <div className="absolute left-0 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
      <div className="absolute left-[.36rem] min-h-[600px] w-[0.5px] bg-black" />
      <div className="ml-12 flex flex-col gap-1">
        <h4>
          <BaseInput
            defaultValue={dateOfEmployment}
            placeholder={dateOfEmployment}
            className="w-full text-[1rem] font-bold"
            name={`dateOfEmployment-${index}`}
          />
        </h4>
        <BaseInput
          defaultValue={companyName}
          placeholder={companyName}
          name={`companyName-${index}`}
          className="w-full text-[1rem] font-bold"
        />
        <BaseInput
          defaultValue={jobTitle}
          placeholder={jobTitle}
          name={`jobTitle-${index}`}
          className="w-full italic"
        />
        <Textarea
          defaultValue={story}
          placeholder={story}
          name={`story-${index}`}
        />
      </div>
    </div>
  );
});

export const RightHalf = () => {
  const { rawData, state } = useDraftContext();
  const { name, jobTitle } = state;
  const { vacancy } = rawData;
  const { stories } = useStories(vacancy.description);

  return (
    <section className="bg-white px-[2rem] py-[5rem] clr-black">
      <div className="flex flex-col gap-8">
        <div>
          <span className="large mb-3">
            <BaseInput
              defaultValue={name}
              placeholder={name}
              name="name"
              className="w-full font-bold"
            />
          </span>
          <BaseInput
            defaultValue={jobTitle}
            placeholder={jobTitle}
            name="jobTitle"
            className="w-full text-[1rem]"
          />
        </div>
        <div>
          <h2 className="mb-5 border-b-2 border-solid border-black pb-3 text-[1.5rem] font-bold">
            <BaseInput
              defaultValue="Experience"
              placeholder="Experience"
              name="experience"
              className="w-full text-[1.3rem]"
            />
          </h2>
          {Boolean(stories.length) &&
            stories.map((story, index) => (
              <Timeline
                key={story}
                story={story}
                jobTitle={jobTitle}
                index={index}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
