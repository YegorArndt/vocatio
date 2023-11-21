import { Autoresize } from "~/modules/create/components/Autoresize";
import { api } from "~/utils";
import { type StoryComponentProps } from "../Story";

export const _2 = (props: StoryComponentProps) => {
  const { id, story, dateOfEmployment, companyName } = props;
  const { data: user } = api.users.get.useQuery();

  const employmentLocation = user?.ownCountry || "Russia";

  return (
    <div className="flex flex-col gap-1 pb-4 first:mt-4">
      <Autoresize
        id={`companyName-${id}`}
        className="text-[1rem] font-bold"
        value={companyName}
      />
      <Autoresize
        id={`employmentLocation-${id}`}
        className="text-[1rem] font-bold"
        value={employmentLocation}
      />
      <Autoresize
        id={`dateOfEmployment-${id}`}
        className=" text-[1rem] font-bold"
        value={dateOfEmployment}
      />
      <Autoresize id={id} value={story} />
    </div>
  );
};
