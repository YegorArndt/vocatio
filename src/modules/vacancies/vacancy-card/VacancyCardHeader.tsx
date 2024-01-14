import { Vacancy } from "@prisma/client";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/external/Tooltip";
import { MenuHeader, SubMenu } from "@szhsin/react-menu";
import { BsThreeDots } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import { BlurImage } from "~/components";
import { CustomMenu } from "~/components/external/CustomMenu";
import { CustomMenuButton } from "~/components/external/CustomMenuButton";
import { CustomMenuItem } from "~/components/external/CustomMenuItem";
import { DrawerTrigger } from "~/components/external/Drawer";
import { typedKeys } from "~/modules/draft/utils/common";
import { api, cn } from "~/utils";
import { EditVacancyDrawer } from "../EditVacancyDrawer";
import { useVacanciesContext } from "../VacanciesContext";
import { omit } from "lodash-es";
import { Link } from "~/components/ui/buttons/Link";

export const VacancyCardHeader = (props: { vacancy: Vacancy }) => {
  const { vacancy } = props;
  const { groupedVacancies, setGroupedVacancies } = useVacanciesContext();

  const groupKeys = typedKeys(omit(groupedVacancies, "all"));

  const { mutate: update } = api.vacancies.upsert.useMutation({});
  const { mutate: deleteVacancy } = api.vacancies.deleteForUser.useMutation();

  const updateGroup = (newGroup: string) => {
    setGroupedVacancies((grouped) => {
      const updated = { ...grouped };
      let isSuccess = false;

      for (const key in grouped) {
        if (key === "all") continue;

        const vacancyWithGroup = grouped[key]?.vacancies.find(
          (v) => v.id === vacancy.id
        );

        if (vacancyWithGroup?.group === newGroup) {
          toast.info(`Vacancy is already in "${newGroup}".`);
          return grouped;
        }

        if (vacancyWithGroup) {
          updated[key]!.vacancies = grouped[key]!.vacancies.filter(
            (v) => v.id !== vacancy.id
          );
          updated[newGroup]!.vacancies.push(vacancy);

          isSuccess = true;
          break;
        }
      }

      /**
       * Means that the vacancy is being moved from "All" group.
       */
      if (!isSuccess) {
        updated[newGroup]!.vacancies.push(vacancy);
      }

      toast.success(`Vacancy moved to "${newGroup}".`);

      return updated;
    });

    update({
      id: vacancy.id,
      group: newGroup,
      description: vacancy.description,
    });
  };

  const deleteVacancyFromGroups = () => {
    setGroupedVacancies((grouped) => {
      const updated = { ...grouped };
      let hasRemovedFromAll = false;

      for (const key in grouped) {
        const vacancyWithGroup = grouped[key]?.vacancies.find(
          (v) => v.id === vacancy.id
        );

        if (vacancyWithGroup) {
          updated[key]!.vacancies = grouped[key]!.vacancies.filter(
            (v) => v.id !== vacancy.id
          );
        }

        if (hasRemovedFromAll && vacancyWithGroup) break;

        if (key === "all") hasRemovedFromAll = true;
      }

      return updated;
    });

    toast.success(`Vacancy deleted.`);

    deleteVacancy({
      vacancyId: vacancy.id,
    });
  };

  const menu = (
    <CustomMenu
      menuButton={
        <CustomMenuButton className="shrink-0 rounded-full px-1 py-3">
          <BsThreeDots />
        </CustomMenuButton>
      }
    >
      <SubMenu label="Add to a group">
        {!!groupKeys.length ? (
          groupKeys.map((name) => {
            return (
              <CustomMenuItem
                key={name as string}
                className="flex-y gap-3 text-[0.8rem]"
                onClick={() => updateGroup(name)}
              >
                {groupedVacancies[name]?.label}
              </CustomMenuItem>
            );
          })
        ) : (
          <MenuHeader className="normal-case">None yet</MenuHeader>
        )}
      </SubMenu>

      {!!vacancy.sourceUrl && (
        <CustomMenuItem>
          <Link
            frontIcon={<FaLinkedin />}
            text="View Source"
            to={vacancy.sourceUrl}
            newTab
            className="flex-y"
          />
        </CustomMenuItem>
      )}

      <CustomMenuItem onClick={deleteVacancyFromGroups}>
        <RiDeleteBin6Line />
        Delete vacancy
      </CustomMenuItem>
    </CustomMenu>
  );

  return (
    <header className="flex-y gap-2 p-3">
      <BlurImage
        src={vacancy.image || "/favicon.ico"}
        height={35}
        width={35}
        alt="logo"
        className={cn("shrink-0", {
          "rounded-full": vacancy.image,
        })}
      />
      <div className="flex w-full flex-col truncate [&>*]:truncate">
        <section className="flex-between">
          <EditVacancyDrawer
            vacancy={vacancy}
            heading={
              <span className="flex-y gap-3">
                {vacancy.companyName}
                {vacancy.image && (
                  <BlurImage
                    src={vacancy.image}
                    height={30}
                    width={30}
                    alt="logo"
                    className="rounded-full"
                  />
                )}
              </span>
            }
            trigger={
              <DrawerTrigger className="flex-y gap-1 truncate hover:underline">
                <LiaEditSolid size={20} className="shrink-0" />
                <h3 className="cursor-pointer truncate text-[1.1rem]">
                  {vacancy.companyName || "Unknown company"}
                </h3>
              </DrawerTrigger>
            }
            onClick={() => toast.success("Vacancy updated.")}
          />
          {menu}
        </section>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default truncate text-start text-[0.8rem] italic">
              {vacancy.jobTitle}
            </TooltipTrigger>
            <TooltipContent>{vacancy.jobTitle}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};