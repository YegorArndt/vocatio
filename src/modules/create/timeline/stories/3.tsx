import { Autoresize } from "~/modules/create/components/Autoresize";
import { api } from "~/utils";
import { type StoryComponentProps } from "../Story";
import { List } from "~/modules/create/components/List";
import { highlights } from "../../constants/FRONTEND";

export const _3 = (props: StoryComponentProps) => {
  const { id, story, dateOfEmployment, companyName, jobTitle } = props;
  const { data: user } = api.users.get.useQuery();

  return (
    <div className="flex flex-col gap-1 pb-4 first:mt-4">
      <div>
        <Autoresize
          id={`companyName-${id}`}
          className="text-[1rem] font-bold"
          value={companyName}
        />
        <span className="px-3">|</span>
        <Autoresize
          id={`employmentLocation-${id}`}
          className="text-[1rem] font-bold"
          value={dateOfEmployment}
        />
      </div>
      <Autoresize
        id={`dateOfEmployment-${id}`}
        className=" text-[1rem] font-bold"
        value={jobTitle}
      />
      <List items={highlights} />
    </div>
  );
};
