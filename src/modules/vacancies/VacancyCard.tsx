import type { Vacancy } from "@prisma/client";
import { Link } from "../../components/ui/buttons/Link";
import { vacancyUI } from "./constants";
import { Accordion } from "./Accordion";
import { IoEye, IoLocationOutline } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { LiaExternalLinkAltSolid, LiaTimesSolid } from "react-icons/lia";
import { FaClockRotateLeft } from "react-icons/fa6";

import { Button } from "~/components/ui/buttons/Button";
import { BlurImage, Chip, Spinner } from "~/components";
import { Falsy } from "./utils";
import { FaDollarSign } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Gpt } from "~/components/icons";
import { FcCheckmark } from "react-icons/fc";
import { lowerCase, startCase } from "lodash-es";
import { api } from "~/utils";

const { log } = console;

type VacancyCardProps = {
  vacancy: Vacancy;
};

const getSalaryRange = (
  min: Falsy<string>,
  max: Falsy<string>,
  isAnnualSalary: Falsy<boolean>
) => {
  const isValid = min && max;
  if (!isValid) return null;

  const salary = +min === +max ? min : `${min} - ${max}`;
  const salaryType = isAnnualSalary ? "annually" : "monthly";

  return `${salary} ${salaryType}`;
};

export const VacancyCard = (props: VacancyCardProps) => {
  const { vacancy } = props;
  const {
    image,
    companyName,
    jobTitle,
    sourceName,
    sourceUrl,
    age,
    createdAt,
    salaryMax,
    salaryMin,
    isAnnualSalary,
    location,
    requiredSeniority,
    employmentType,
    summary,
  } = vacancy;
  const [isLastEdited, setIsLastEdited] = useState(false);
  const { data: drafts, isLoading: draftsLoading } =
    api.drafts.getAll.useQuery();

  useEffect(() => {
    const lastEdited = localStorage.getItem("last-edited-vacancy");
    const isLastEdited = lastEdited === vacancy.id;

    if (isLastEdited) setIsLastEdited(true);
  }, []);

  const hasCv = drafts?.some((d) => d.vacancyId === vacancy.id);

  return (
    <div>
      <div className="clr-card relative rounded-md border bg-card shadow-md">
        {isLastEdited && (
          <Chip
            text="CV in progress"
            className="bg-sky absolute -top-3 right-0 px-3"
          />
        )}
        <header className="flex flex-col gap-8 p-4">
          <div className="flex-y gap-5">
            {image && (
              <BlurImage
                src={image}
                height={70}
                width={70}
                alt="logo"
                className="rounded-full"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">{companyName}</h3>
              <em>{jobTitle}</em>
            </div>
            <Link
              className="flex-y ml-auto gap-1 text-[1.5rem]"
              to={sourceUrl!}
              newTab
            >
              {vacancyUI[sourceName as keyof typeof vacancyUI].icon}
              <LiaExternalLinkAltSolid />
            </Link>
          </div>
          <section className="flex flex-col gap-1">
            <div className="flex-y gap-2">
              {draftsLoading ? (
                <Spinner />
              ) : hasCv ? (
                <FcCheckmark />
              ) : (
                <LiaTimesSolid color="red" />
              )}{" "}
              {draftsLoading ? "Generating CV..." : "CV generated"}
            </div>
            <div className="flex-y gap-2">
              {vacancyUI[sourceName as keyof typeof vacancyUI].icon} Posted:
              <em> {age!.toDateString()}</em>
            </div>
            <div className="flex-y gap-2">
              <FaClockRotateLeft />
              You added:<em>{createdAt.toDateString()}</em>
            </div>
          </section>
        </header>
        <Accordion
          trigger={(expanded, setExpanded) => (
            <Button
              text={expanded ? "Hide details" : "Show known details"}
              className="border-top flex-y w-full justify-between border-y p-4 clr-blue"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <IoMdEyeOff /> : <IoEye />}
            />
          )}
        >
          <ul className="flex flex-col gap-2 p-4">
            {[
              [
                <FaDollarSign />,
                getSalaryRange(salaryMin, salaryMax, isAnnualSalary),
              ],
              [<IoLocationOutline />, location],
              [<MdWorkOutline />, startCase(lowerCase(employmentType))],
              [<BsPersonWorkspace />, startCase(lowerCase(requiredSeniority))],
            ].map(
              ([icon, value]) =>
                !!value && (
                  <li key={value.toString()} className="flex-y gap-3">
                    {icon}
                    {value}
                  </li>
                )
            )}
            {Boolean(summary) && <li className="mt-3">{summary}</li>}
          </ul>
        </Accordion>
        <footer className="flex-y gap-8 p-4">
          <Link
            to={`create/${vacancy.id}`}
            frontIcon={<Gpt />}
            text={
              isLastEdited
                ? "Back to editing"
                : hasCv
                ? "View CV"
                : "Generate CV"
            }
            className="flex-y hover:underline"
          />
          <Button
            text="Start thread"
            frontIcon={<>🧵</>}
            className="flex-y !bg-transparent hover:underline"
            disabled
            data-tooltip-id="thread"
          />
          <Tooltip
            id="thread"
            render={() => (
              <>
                Share insights on the interview process, the company, and get
                rewarded.
                <br /> Coming soon.
              </>
            )}
            opacity={1}
            variant="light"
            place="bottom"
            delayShow={1000}
          />
        </footer>
      </div>
    </div>
  );
};
