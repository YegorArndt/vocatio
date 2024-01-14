import cn from "classnames";
import { Link } from "../../../components/ui/buttons/Link";
import { Accordion } from "../Accordion";
import { IoEye, IoLocationOutline } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import type { Vacancy } from "@prisma/client";
import { lowerCase, startCase } from "lodash-es";
import { FaDollarSign } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";

import { Button } from "~/components/ui/buttons/Button";
import { Gpt } from "~/icons";
import { VacancyCardHeader } from "./VacancyCardHeader";

const { log } = console;

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

export const VacancyCard = (props: { vacancy: Vacancy }) => {
  const { vacancy } = props;
  const {
    salaryMax,
    salaryMin,
    isAnnualSalary,
    location,
    requiredSeniority,
    employmentType,
    summary,
  } = vacancy;

  return (
    <div>
      <div
        className={cn("clr-card relative rounded-md border bg-card shadow-md")}
      >
        <VacancyCardHeader vacancy={vacancy} />
        <Link
          to={`create/${vacancy.id}`}
          frontIcon={<Gpt />}
          text="View CV"
          baseCn="flex-y hover:underline text-[0.8rem] p-3 w-min whitespace-nowrap"
        />
        <Accordion
          trigger={(expanded, setExpanded) => (
            <Button
              text={expanded ? "Hide details" : "Show known details"}
              className="border-top flex-y border-top w-full p-3 text-[0.8rem]"
              onClick={() => setExpanded(!expanded)}
              frontIcon={expanded ? <IoMdEyeOff /> : <IoEye />}
            />
          )}
        >
          <ul className="flex flex-col gap-2 p-3">
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
                  <li key={i} className="flex-y gap-3 text-[0.8rem]">
                    {icon}
                    {value}
                  </li>
                )
            )}
            {!!summary && (
              <li className="mt-3 flex flex-col gap-1">
                <h4 className="text-[0.9rem]">✨ AI generated summary</h4>
                <span className="text-[0.8rem]">{summary}</span>
              </li>
            )}
          </ul>
        </Accordion>
      </div>
    </div>
  );
};
