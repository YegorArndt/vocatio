import Link from "next/link";
import { useState } from "react";

import type { Vacancy } from "~/modules/extension/types";

export const VacancyCard: React.FC<Vacancy> = (props: Vacancy) => {
  const {
    id,
    companyName,
    location,
    age,
    numApplicants,
    salaryRange,
    level,
    jobTitle,
    requirements,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Link
      href={`cv-builder/${id}`}
      className="border-gray-200 w-96 rounded-lg border p-4 shadow-sm"
    >
      <h2 className="mb-2 text-xl font-bold">{jobTitle}</h2>
      <p className="text-gray-600 mb-2">{companyName}</p>
      <p className="text-gray-500 mb-2 text-sm">{location}</p>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-400">{age}</span>
        <span className="text-gray-400">{numApplicants} applicants</span>
      </div>
      <p className="text-gray-600 mb-2 text-sm">{salaryRange}</p>
      <p className="text-gray-500 mb-2 text-sm">{level}</p>
      <div
        className="border-gray-200 overflow-y-hidden border-t pt-2"
        style={{ maxHeight: isExpanded ? "none" : "100px" }}
      >
        <p className="text-gray-600 text-sm">Requirements:</p>
        <p className="text-gray-500 mt-2 whitespace-pre-line text-xs">
          {requirements}
        </p>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-indigo-500 transition hover:text-indigo-700"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </Link>
  );
};
