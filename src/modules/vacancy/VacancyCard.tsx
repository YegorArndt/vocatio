import type { Vacancy } from "@prisma/client";
import { Link } from "../../components/ui/buttons/Link";
import { breakDown } from "./utils";
import { useGlare } from "./useGlare";
import { vacancyUI } from "./constants";
import { Accordion } from "./Accordion";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

import { Button } from "~/components/ui/buttons/Button";

export const VacancyCard = (props: { vacancy: Vacancy }) => {
  const { vacancy } = props;
  const tiltRef = useGlare();
  const { header, available, unavailable } = breakDown(vacancy);

  const { companyName, jobTitle, age, sourceName, sourceUrl, createdAt } =
    header;

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={tiltRef}
        className="tilt relative rounded-md border bg-primary shadow-md"
      >
        <header className="flex flex-col gap-2 p-4">
          <h3 className="text-xl font-bold">{companyName}</h3>
          <span className="italic">{jobTitle}</span>
          {age && (
            <small>
              Posted on {sourceName}: {age.toDateString()}
            </small>
          )}
          <small>
            Added to your vacancies: {createdAt.toDateString()} (after{" "}
            {age?.getUTCDate()} days)
          </small>
          {(sourceName || sourceUrl) && (
            <div className="flex items-center gap-2">
              {sourceName &&
                vacancyUI[sourceName as keyof typeof vacancyUI].icon}
              {sourceUrl && (
                <Link
                  text="View source"
                  className="text-[13px] clr-blue"
                  to={sourceUrl}
                  newTab
                />
              )}
            </div>
          )}
        </header>
        {[available, unavailable].map(
          (items, index) =>
            Boolean(items.length) && (
              <Accordion
                key={index}
                trigger={(expanded, setExpanded) => (
                  <div className="flex justify-between border-y p-4">
                    {index === 0
                      ? "🐈 Known about this vacancy"
                      : "😿 Unknown about this vacancy"}
                    <Button
                      text={expanded ? "Hide" : "Show"}
                      frontIcon={expanded ? <IoMdEyeOff /> : <IoEye />}
                      onClick={() => setExpanded(!expanded)}
                      className="text-[13px] clr-blue"
                    />
                  </div>
                )}
                initiallyOpen={index === 0}
              >
                <ul className="accordion flex flex-col gap-3 p-4">
                  {items.map(({ text, icon, value }) =>
                    index === 0 ? (
                      <li key={text} className="flex-between">
                        <span className="flex-center gap-2">
                          {icon} {text}:
                        </span>
                        <span>{value?.toString()}</span>
                      </li>
                    ) : (
                      <li key={text} className="flex">
                        <span className="flex-center gap-2">
                          {icon} {text}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </Accordion>
            )
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Link
          text="Get CV"
          className="primary sm"
          to={`create/${vacancy.id}`}
        />
      </div>
    </div>
  );
};
