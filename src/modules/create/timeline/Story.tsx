import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { getRandomCompanyName } from "../utils";
import { Timeline } from "~/modules/draft/types";

type Styles = Omit<Timeline["styles"], "timelineClassNames">;

export type StoryProps = {
  id: string;
  index: number;
  story: string;
  styles: Styles;
  jobTitle?: string;
  dateOfEmployment?: string;
};

const getCompanyName = (id: string) => {
  const parts = id.split("-");

  if (parts.length >= 3) return parts[parts.length - 1];
  return getRandomCompanyName();
};

const getEmploymentDate = (index: number) => {
  const coefficient = index + 1;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - coefficient * 2;
  const endYear = startYear + 2 > currentYear ? currentYear : startYear + 2;
  return `${startYear} - ${endYear}`;
};

const Ball = (props: { className: string }) => <div {...props} />;

const Line = (props: { className: string }) => <div {...props} />;

export const Story = (props: StoryProps) => {
  const { jobTitle, id, story, index, styles } = props;

  const dateOfEmployment = getEmploymentDate(index);
  const companyName = getCompanyName(id);

  const {
    storyClassNames,
    dateOfEmploymentClassNames,
    companyNameClassNames,
    jobTitleClassNames,
    ballClassNames,
    lineClassNames,
  } = styles;

  return (
    <div className={storyClassNames}>
      <Ball className={ballClassNames} />
      <Line className={lineClassNames} />
      <Autoresize
        id={`dateOfEmployment-${id}`}
        className={dateOfEmploymentClassNames}
        value={dateOfEmployment}
      />
      <Autoresize
        id={`companyName-${id}`}
        className={companyNameClassNames}
        value={companyName}
      />
      <Autoresize
        id={`jobTitle-${id}`}
        className={jobTitleClassNames}
        value={jobTitle}
      />
      <Autoresize id={id} value={story} className={storyClassNames} />
    </div>
  );
};
