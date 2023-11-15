import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { type StoryComponentProps } from "../Story";

export const _1 = (props: StoryComponentProps) => {
  const { jobTitle, id, story, dateOfEmployment, companyName } = props;

  return (
    <div className="relative flex flex-col gap-1 pb-4 pl-6 first:mt-4">
      <div className="absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
      <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
      <Autoresize
        id={`dateOfEmployment-${id}`}
        className="pl-6 text-[1rem] font-bold"
        value={dateOfEmployment}
      />
      <Autoresize
        id={`companyName-${id}`}
        className="pl-6 text-[1rem] font-bold"
        value={companyName}
      />
      <Autoresize
        id={`jobTitle-${id}`}
        className="pl-6 italic"
        value={jobTitle}
      />
      <Autoresize id={id} value={story} className="pl-6" />
    </div>
  );
};
