import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import {
  FaClock,
  FaDollarSign,
  FaGlobe,
  FaLinkedin,
  FaUsers,
} from "react-icons/fa";

import type { Falsy } from "~/types/utils";
import type { SourceName, Vacancy } from "@prisma/client";
import { Link } from "./ui/buttons/Link";
import classNames from "classnames";
import { Button } from "./ui/buttons/Button";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

type VacancyCardProps = {
  vacancy: Vacancy;
};

const getSalaryRange = (min: Falsy<number>, max: Falsy<number>) =>
  min && max ? `${min} - ${max} (annually or monthly)` : "N/A";

const sourceIcons: Partial<Record<SourceName, JSX.Element>> = {
  LINKEDIN: <FaLinkedin />,
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
    sourceName,
    sourceUrl,
    requiredEducation,
    requiredLanguages,
    requiredRemote,
    requiredSeniority,
    requiredSkills,
    requiredYears,
  } = vacancy;
  const [isExpanded, setIsExpanded] = useState(false);

  const req = {
    education: requiredEducation,
    languages: requiredLanguages,
    remote: requiredRemote,
    seniority: requiredSeniority,
    skills: requiredSkills,
    years: requiredYears,
  };

  const hasRequirements = Object.values(req).some((value) => value);

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
          <small>Added to your vacancies: {createdAt.toDateString()}</small>
        </header>
        <ul className="flex flex-col gap-3">
          {[
            {
              icon: <FaDollarSign />,
              text:
                // prettier-ignore
                (salaryMin || salaryMax)
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
          <li className="flex-between">
            {sourceUrl && (
              <div className="flex items-center gap-3">
                {sourceName && sourceIcons[sourceName]}
                <Link
                  text="View source"
                  className="clr-blue"
                  to={sourceUrl}
                  newTab
                />
              </div>
            )}
            {hasRequirements && (
              <Button
                frontIcon={isExpanded ? <AiFillEyeInvisible /> : <AiFillEye />}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="clr-blue">
                  {isExpanded ? "Hide requirements" : "View requirements"}
                </span>
              </Button>
            )}
          </li>
          {isExpanded && (
            <li className="border-top flex flex-col gap-2 pt-3">
              <h4>Requirements</h4>
              <ul className="flex flex-col gap-1">
                {Object.entries(req).map(
                  ([key, value]) =>
                    value && (
                      <li key={key}>
                        <span className="font-bold">{key}</span>: {value}
                      </li>
                    )
                )}
              </ul>
            </li>
          )}
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
