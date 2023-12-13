import type { Vacancy } from "@prisma/client";
import { Link } from "../../components/ui/buttons/Link";
import { breakDown } from "./utils";
import { vacancyUI } from "./constants";
import { Accordion } from "./Accordion";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

import { Button } from "~/components/ui/buttons/Button";
import { BlurImage } from "~/components";

const { log } = console;

export const VacancyCard = (props: { vacancy: Vacancy }) => {
  const { vacancy } = props;
  const { header, available, unavailable } = breakDown(vacancy);
  const {
    companyName,
    jobTitle,
    age,
    sourceName,
    sourceUrl,
    createdAt,
    image,
  } = header;

  return (
    <div className="flex flex-col gap-5">
      <div className="clr-card relative rounded-md border bg-card shadow-md">
        <header className="flex flex-col gap-8 p-4">
          <div className="flex-y gap-5">
            <BlurImage
              src={image}
              height={70}
              width={70}
              alt={companyName}
              className="rounded-full"
            />
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
          <div className="grid grid-cols-2">
            <span>Posted on {sourceName}:</span>
            <em> {age!.toDateString()}</em>
            <span>Visited:</span>
            <em>{createdAt.toDateString()}</em>
          </div>
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
          <ul className="grid grid-cols-2 gap-2 p-4">
            {available.map(({ text, icon, value }) => (
              <li key={text} className="flex-y gap-3">
                <span className="flex-center">{icon}</span>
                <span>{value?.toString()}</span>
              </li>
            ))}
          </ul>
        </Accordion>
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
