import { HiOutlinePlusCircle } from "react-icons/hi2";
import { DrawerTrigger } from "~/components/ui/external/Drawer";
import { EditVacancyDrawer } from "./EditVacancyDrawer";
import { api } from "~/utils";
import { BrowseVacanciesLink } from "~/components/BrowseVacancies";

const { log } = console;

export const VacanciesPageToolbar = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  return (
    <>
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
      />
      <BrowseVacanciesLink />
    </>
  );
};
