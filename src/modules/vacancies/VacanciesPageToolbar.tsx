import { HiOutlinePlusCircle } from "react-icons/hi2";
import { DrawerTrigger } from "~/components/ui/external/Drawer";
import { EditVacancyDrawer } from "./EditVacancyDrawer";
import { api, cn } from "~/utils";
import { startCvGeneration } from "~/utils/startCvGeneration";
import { Link } from "~/components/ui/buttons/Link";
import { LinkedinColor } from "~/components/icons";
import { linkedinJobsSearchUrl } from "~/constants";

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
        onClick={(updatedVacancy) =>
          startCvGeneration({ vacancy: updatedVacancy, model: "mixtral" })
        }
      />
      <Link
        frontIcon={<LinkedinColor />}
        text="Browse vacancies"
        to={
          user?.vacancies.find((v) => v.sourceUrl)?.sourceUrl ||
          linkedinJobsSearchUrl
        }
        baseCn="common hover flex-y gap-2"
        className={cn({
          "pointer-events-none opacity-50": userLoading,
        })}
        newTab
      />
    </>
  );
};
