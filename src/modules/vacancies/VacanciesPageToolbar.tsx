import { HiOutlinePlusCircle } from "react-icons/hi2";
import { DrawerTrigger } from "~/components/external/Drawer";
import { api } from "~/utils";
import { PartialUser } from "../extension/types";
import { EditVacancyDrawer } from "./EditVacancyDrawer";
import { startCvGeneration } from "~/utils/startCvGeneration";

export const VacanciesPageToolbar = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <EditVacancyDrawer
      isCreate
      heading={
        <div className="flex flex-col">
          <span>
            Add a vacancy manually. Vocatio will generate a CV for it
            automatically 👌🏻
          </span>
          <small className="text-sm clr-disabled">
            Only description is required. The rest is optional.
          </small>
        </div>
      }
      trigger={
        <DrawerTrigger role="button" className="common hover flex-y gap-3">
          <HiOutlinePlusCircle /> Add manually
        </DrawerTrigger>
      }
      onClick={(updatedVacancy) =>
        startCvGeneration(updatedVacancy, user as PartialUser)
      }
    />
  );
};
