import cn from "classnames";
import type { Vacancy } from "@prisma/client";
import { Link } from "../../components/ui/buttons/Link";
import { vacancyUI } from "./constants";
import { Accordion } from "./Accordion";
import { IoEye, IoLocationOutline } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { FaClockRotateLeft } from "react-icons/fa6";

import { Button } from "~/components/ui/buttons/Button";
import { BlurImage, Chip, Spinner } from "~/components";
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

type Nullable = string | null;

const getSalaryRange = (
  min: Nullable,
  max: Nullable,
  isAnnualSalary: boolean
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
  const { data: drafts, isError } = api.drafts.getAll.useQuery();

  const hasCv = drafts?.some((d) => d.vacancyId === vacancy.id) && !isError;

  useEffect(() => {
    const lastEdited = localStorage.getItem("last-edited-vacancy");
    const isLastEdited = lastEdited === vacancy.id;

    if (isLastEdited) setIsLastEdited(true);
  }, []);

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
              to={sourceUrl}
              newTab
            >
              {vacancyUI[sourceName as keyof typeof vacancyUI].icon}
              <LiaExternalLinkAltSolid />
            </Link>
          </div>
          <section className="flex flex-col gap-1">
            <div className="flex-y gap-2">
              {hasCv && <FcCheckmark />}
              {hasCv && "CV generated"}
              {!hasCv && <Spinner size={14} />}
              {!hasCv && "Generating CV..."}
              {isError && "Error generating CV"}
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
              // eslint-disable-next-line react/jsx-key
              [
                // eslint-disable-next-line react/jsx-key
                <FaDollarSign />,
                getSalaryRange(salaryMin, salaryMax, isAnnualSalary!),
              ],
              // eslint-disable-next-line react/jsx-key
              [<IoLocationOutline />, location],
              // eslint-disable-next-line react/jsx-key
              [<MdWorkOutline />, startCase(lowerCase(employmentType!))],
              // eslint-disable-next-line react/jsx-key
              [<BsPersonWorkspace />, startCase(lowerCase(requiredSeniority!))],
            ].map(
              ([icon, value], i) =>
                !!value && (
                  <li key={i} className="flex-y gap-3">
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
            text={hasCv ? "View CV" : "Generating CV..."}
            baseCn="flex-y hover:underline"
            className={cn({
              "clr-disabled": !hasCv,
              "pointer-events-none": !hasCv,
            })}
            disabled={!hasCv}
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
