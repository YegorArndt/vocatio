import type { Vacancy } from "@prisma/client";
import { BlurImage } from "~/components";
import { LinkedinColor, Location } from "~/components/icons";
import { FaHouseLaptop } from "react-icons/fa6";
import { debounce, omit } from "lodash-es";
import { getIcon, typedKeys } from "~/modules/utils";
import { api, cn } from "~/utils";
import { useVacanciesContext } from "../VacanciesContext";
import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/external/Sheet";
import { Button } from "~/components/ui/buttons/Button";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { createContext, useContext, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/external/Dropdown";
import { getDefaultIcon } from "../constants";
import { Switch } from "~/components/ui/external/Switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/external/Accordion";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

const { log } = console;

type VacancyCardProps = {
  vacancy: Vacancy;
};

const VacancyContext = createContext({} as VacancyCardProps);

const useVacancyActions = (vacancy: Vacancy) => {
  const { groupedVacancies, setGroupedVacancies } = useVacanciesContext();
  const groupKeys = typedKeys(omit(groupedVacancies, "all"));

  const { mutate: update } = api.vacancies.upsert.useMutation();
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

  return {
    updateGroup,
    deleteVacancyFromGroups,
    groupKeys,
  };
};

const CompanyPresentator = () => {
  const { vacancy } = useContext(VacancyContext);

  return (
    <section className="flex-y gap-3">
      <BlurImage src={vacancy.image} />
      <div className="flex flex-col">
        <h5>{vacancy.companyName}</h5>
        <small className="clr-ghost">{vacancy.jobTitle}</small>
      </div>
    </section>
  );
};

const SalaryColumn = () => {
  const { vacancy } = useContext(VacancyContext);

  return (
    <section className="flex-y gap-2">{vacancy.salary || "$ N/A"}</section>
  );
};

const LocationColumn = () => {
  const { vacancy } = useContext(VacancyContext);

  return (
    <section className="flex-y gap-2">
      <Location />
      {vacancy.location || "N/A"}
    </section>
  );
};

const WorkSettingColumn = () => {
  const { vacancy } = useContext(VacancyContext);

  return (
    <section className="flex-y gap-2">
      <FaHouseLaptop fontSize={17} />
      {vacancy.requiredRemote || "N/A"}
    </section>
  );
};

const ViewCvButton = () => {
  const { vacancy } = useContext(VacancyContext);

  return typeof window === "undefined" ? null : (
    <Link
      to={`/create/${vacancy.id}`}
      frontIcon={
        <BlurImage src="/designs/charizard.png" height={15} width={15} />
      }
      text="CV"
      className="primary sm gap-1"
      onClick={(e) => e.stopPropagation()}
    />
  );
};

const ChangeGroupButton = () => {
  const { vacancy } = useContext(VacancyContext);
  const { updateGroup, groupKeys } = useVacancyActions(vacancy);
  const { currentGroup } = useVacanciesContext();

  const is = (group: string) => vacancy.group?.toLowerCase()?.includes(group);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="primary xs gap-2 rounded-sm">
        <div className="flex-y gap-2">
          {vacancy.group !== currentGroup && (
            <span>{getDefaultIcon(vacancy.group)}</span>
          )}
          {vacancy.group === currentGroup
            ? "Move to"
            : vacancy.group || "Move to"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuSeparator />
      <DropdownMenuContent>
        <DropdownMenuLabel>Move to</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {groupKeys.map((group) => (
          <DropdownMenuItem
            key={group}
            onClick={(e) => {
              updateGroup(group);
              e.stopPropagation();
            }}
            className="flex-y gap-2"
          >
            <span>{getDefaultIcon(group)}</span>
            {group}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const isMissingSkill = (skill: string, userSkills: string[]) => {
  const format = (str: string) => str.toLowerCase().replace(/[-_ .]/g, "");

  const calculateOverlapPercentage = (str1: string, str2: string) => {
    const minLength = Math.min(str1.length, str2.length);
    let overlapCount = 0;
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        overlapCount++;
      }
    }
    return (overlapCount / minLength) * 100;
  };

  return !userSkills.some((userSkill) => {
    const skillFormatted = format(skill);
    const userSkillFormatted = format(userSkill);
    const overlapPercentage = calculateOverlapPercentage(
      skillFormatted,
      userSkillFormatted
    );
    return overlapPercentage >= 80;
  });
};

const calculateHowManySkillsMatchPercentage = (
  requiredSkills: string[],
  userSkills: string[]
) => {
  const missingSkills = requiredSkills.filter((skill) =>
    isMissingSkill(skill, userSkills)
  );

  return 100 - 100 * (missingSkills.length / requiredSkills.length);
};

const SkillsSection = () => {
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();
  const { mutate: updateUser, isLoading: isUpdating } =
    api.users.update.useMutation();
  const { vacancy } = useContext(VacancyContext);

  const [detectionOn, setDetectionOn] = useState(false);
  /**
   * Temporary storage for skills that are added to the user.
   * This is to avoid unnecessary API calls.
   */
  const [skillBasket, setSkillBasket] = useState([] as string[]);

  const missingSkills = vacancy.requiredSkills.filter((skill) =>
    isMissingSkill(skill, [
      ...(user?.skills.map((s) => s.name) || []),
      ...skillBasket,
    ])
  );

  const matchPercentage = calculateHowManySkillsMatchPercentage(
    vacancy.requiredSkills,
    [...(user?.skills.map((s) => s.name) || []), ...skillBasket]
  ).toFixed(2);

  const addSkill = (skill: string) => {
    if (!user || !detectionOn) return;

    setSkillBasket((prev) => {
      const updatedSkills = [...prev, skill];

      const updateUserSkills = debounce(() => {
        updateUser({
          skills: [
            ...user.skills,
            ...updatedSkills.map((x) => ({ name: x, value: "Expert" })),
          ],
        });
      }, 5000);

      updateUserSkills();

      return updatedSkills;
    });

    toast.success(`Added "${skill}".`);
  };

  return (
    <section className="flex flex-col gap-8 rounded-md bg-secondary p-5">
      <header className="flex-y gap-3">
        <h4>Required skills ({vacancy.requiredSkills.length})</h4>
        {!!missingSkills.length && detectionOn && (
          <div className="rounded-md bg-dark-yellow px-1 font-semibold">
            Click on a skill to add it to your profile.
          </div>
        )}
      </header>

      <div className="flex-y flex-wrap gap-2">
        {vacancy.requiredSkills.map((skill, index) => (
          <Button
            key={skill}
            frontIcon={getIcon(skill)?.({})}
            text={skill}
            className={cn("flex-y rounded-md border bg-primary p-2", {
              "wave-warning": missingSkills.includes(skill) && detectionOn,
            })}
            onClick={() => addSkill(skill)}
          />
        ))}
      </div>

      <footer className="flex-between">
        <label className="flex-y gap-4">
          Highlight skills I don&apos;t have
          <Switch
            checked={detectionOn}
            onClick={() => setDetectionOn(!detectionOn)}
          />
        </label>
        <div className="clr-ghost">
          <div>
            You match {vacancy.requiredSkills.length - missingSkills.length} /{" "}
            {vacancy.requiredSkills.length} skills{" "}
            <span
              className={cn({
                "clr-green": +matchPercentage >= 50,
                "clr-dark-yellow": +matchPercentage < 50,
                "!clr-red": +matchPercentage < 20,
              })}
            >
              ({matchPercentage}
              %).
            </span>
          </div>
          <small>
            Matching at least 50% is a sign that you are a good fit.
          </small>
        </div>
      </footer>
    </section>
  );
};

const ResponsibilitiesSection = () => {
  const { vacancy } = useContext(VacancyContext);

  return (
    <section className="flex flex-col gap-8 rounded-md bg-secondary p-5">
      <h4>Responsibilities ({vacancy.responsibilities.length})</h4>
      <ul className="flex flex-col gap-4">
        {vacancy.responsibilities.map((res) => (
          <li
            key={res}
            className="flex-y w-min gap-2 whitespace-nowrap rounded-md border bg-primary p-2 before:mr-2 before:content-['•']"
          >
            {res}
          </li>
        ))}
      </ul>
    </section>
  );
};

const OriginalDescriptionAccordion = () => {
  const { vacancy } = useContext(VacancyContext);

  return vacancy.sourceUrl ? (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="primary" arrowSize={0}>
          <span className="flex-y gap-2">
            <LinkedinColor />
            Click to read the original description from LinkedIn
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <Link
            to={vacancy.sourceUrl}
            frontIcon={<LiaExternalLinkAltSolid />}
            text="View source"
            className="clr-ghost-muted hover:ghost-hover flex-center w-full"
            newTab
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mt-4 whitespace-pre-wrap">{vacancy.description}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : null;
};

const Flyout = () => {
  return (
    <SheetContent className="flex flex-col gap-5 overflow-auto">
      <CompanyPresentator />
      <SkillsSection />
      <ResponsibilitiesSection />
      <OriginalDescriptionAccordion />
    </SheetContent>
  );
};

export const VacancyCard = (props: VacancyCardProps) => {
  const { vacancy } = props;
  const { deleteVacancyFromGroups } = useVacancyActions(vacancy);

  return (
    <Sheet>
      <VacancyContext.Provider value={props}>
        <SheetTrigger className="border-bottom vacancies-table flex-y rounded-sm p-1 text-left transition-all ease-in-out hover:border-weiss">
          <CompanyPresentator />
          <SalaryColumn />
          <LocationColumn />
          <WorkSettingColumn />

          <section className="flex-y gap-3">
            <ViewCvButton />
            <Link
              to={vacancy.sourceUrl}
              text="View source"
              frontIcon={<LiaExternalLinkAltSolid />}
              newTab
              className="primary sm"
            />
            <ChangeGroupButton />
            <Button
              className="sm ml-auto rounded-md hover:bg-red"
              onClick={(e) => {
                e.stopPropagation();
                deleteVacancyFromGroups();
              }}
            >
              <RiDeleteBin2Fill />
            </Button>
          </section>
        </SheetTrigger>
        <Flyout />
      </VacancyContext.Provider>
    </Sheet>
  );
};
