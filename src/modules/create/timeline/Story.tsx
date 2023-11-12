import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { getRandomCompanyName } from "../utils";

export type StoryProps = {
  id: string;
  index: number;
  story: string;
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

const Ball = () => (
  <div className="absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
);

const Line = () => (
  <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
);

export const Story = (props: StoryProps) => {
  const { jobTitle, id, story, index } = props;

  const dateOfEmployment = getEmploymentDate(index);
  const companyName = getCompanyName(id);

  return (
    <div className="relative pb-4 first:mt-4">
      <Ball />
      <Line />
      <div className="ml-12 flex flex-col gap-1">
        <Autoresize
          className="w-full text-[1rem] font-bold"
          name={`dateOfEmployment-${id}`}
          value={dateOfEmployment}
          placeholder={dateOfEmployment}
        />
        <Autoresize
          className="w-full text-[1rem] font-bold"
          name={`companyName-${id}`}
          value={companyName}
          placeholder={companyName}
        />
        <Autoresize
          className="w-full italic"
          name={`jobTitle-${id}`}
          value={jobTitle}
          placeholder={jobTitle}
        />
        <Autoresize name={id} value={story} />
      </div>
    </div>
  );
};
