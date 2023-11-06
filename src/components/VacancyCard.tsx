import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { FaClock, FaDollarSign, FaGlobe, FaUsers } from "react-icons/fa";

import type { Falsy } from "~/types/utils";
import type { Vacancy } from "@prisma/client";
import { Link } from "./ui/buttons/Link";
import classNames from "classnames";

const getSalaryRange = (min: Falsy<number>, max: Falsy<number>) =>
  min && max ? `${min} - ${max}` : "N/A";

type VacancyCardProps = {
  vacancy: Vacancy;
};

export const VacancyCard = (props: VacancyCardProps) => {
  const { vacancy } = props;
  const {
    companyName,
    salaryMax,
    salaryMin,
    numApplicants,
    country,
    age,
    createdAt,
    jobTitle,
  } = vacancy;
  const [isExpanded, setIsExpanded] = useState(false);

  const tiltRef = useRef(null);

  useEffect(() => {
    if (!tiltRef.current) return;

    VanillaTilt.init(tiltRef.current, {
      max: 5,
      speed: 100,
      glare: true,
      "max-glare": 0.5,
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={tiltRef}
        className="tilt relative rounded-md border bg-primary shadow-md [&>*]:p-4"
      >
        <header className="border-bottom flex flex-col gap-2">
          <h3 className="text-xl font-bold">{companyName}</h3>
          <span className="italic">{jobTitle}</span>
          <small>
            Added to your vacancies: <br />
            {createdAt.toDateString()}
          </small>
        </header>
        <ul className="flex flex-col gap-3">
          {[
            {
              icon: <FaDollarSign />,
              text:
                salaryMin || salaryMax
                  ? getSalaryRange(salaryMin, salaryMax)
                  : "Unknown salary",
            },
            {
              icon: <FaGlobe />,
              text: country || "Unknown country",
            },
            {
              icon: <FaUsers />,
              text: numApplicants
                ? `${numApplicants} applicants as of ${age?.toDateString()}`
                : "Unknown number of applicants",
            },
            {
              icon: <FaClock />,
              text: age ? `Posted: ${age.toDateString()}` : "Unknown post date",
            },
          ].map(({ icon, text }, index) => (
            <li key={index} className="flex items-center gap-2">
              {icon}
              <span
                className={classNames({
                  "clr-secondary": text.includes("Unknown"),
                })}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Link
          text="Get CV"
          className="primary sm"
          to={`create/${vacancy.id}`}
        />
        {/* <Button text="Start thread" className="primary sm" disabled /> */}
      </div>
    </div>
  );
};
