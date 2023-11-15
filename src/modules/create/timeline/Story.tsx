import { getRandomCompanyName } from "../utils";
import type { StoryType } from "~/modules/draft/types";
import { _1 } from "./stories/1";
import { _2 } from "./stories/2";

export type StoryProps = {
  id: string;
  index: number;
  story: string;
  storyType: StoryType;
  jobTitle?: string;
  dateOfEmployment?: string;
};

export type StoryComponentProps = Omit<StoryProps, "storyType" | "index"> & {
  companyName: string;
};

const getCompanyName = (id: string) => {
  const parts = id.split("-");

  if (parts.length >= 3) return parts[parts.length - 1];
  return getRandomCompanyName();
};

const stories = {
  1: _1,
  2: _2,
};

const getEmploymentDate = (index: number) => {
  const coefficient = index + 1;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - coefficient * 2;
  const endYear = startYear + 2 > currentYear ? currentYear : startYear + 2;
  return `${startYear} - ${endYear}`;
};

export const Story = (props: StoryProps) => {
  const { jobTitle, id, story, index, storyType } = props;

  const dateOfEmployment = getEmploymentDate(index);
  const companyName = getCompanyName(id);

  const StoryComponent = stories[storyType];

  return (
    <StoryComponent
      id={id}
      jobTitle={jobTitle}
      story={story}
      dateOfEmployment={dateOfEmployment}
      companyName={companyName!}
    />
  );
};
