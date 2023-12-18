import cn from "classnames";
import {
  EducationEntry,
  EmploymentHistoryEntry,
  Vacancy,
} from "@prisma/client";
import { ReactNode } from "react";
import { BlurImage } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { vacancyUI } from "../vacancies/constants";
import { Link } from "~/components/ui/buttons/Link";

const { log } = console;

type DiffProps = {
  vacancy: Vacancy;
  jobTitle: {
    old: string;
    new: string;
  };
  professionalSummary: {
    old: string;
    new: string;
  };
  employmentHistory: {
    old: EmploymentHistoryEntry[];
    new: EmploymentHistoryEntry[];
  };
};

type HighlightKeywordsProps = {
  text: string;
  keywords: string[];
  className?: string;
};

const commonWordsToIgnore = new Set([
  "the",
  "and",
  "in",
  "of",
  "to",
  "a",
  "an",
  "about",
  "at",
  "is",
  "for",
  "on",
  "with",
  "as",
  "by",
]);

const highlightKeywords = (props: HighlightKeywordsProps) => {
  const { text, keywords, className = "bg-[#C7FBD5]" } = props;

  // Splitting text into words
  const words = text.split(" ");
  const splitKeywords = keywords
    .filter(Boolean)
    .map((keyword) => keyword.split(" "))
    .flat();

  const highlightedKeywords = new Set();
  const newText = words.map((word, index) => {
    const isKeyword = splitKeywords.some((kw) => {
      const match =
        kw.toLowerCase() === word.toLowerCase() &&
        !commonWordsToIgnore.has(word.toLowerCase());
      if (match) {
        highlightedKeywords.add(word.toLowerCase());
      }
      return match;
    });
    const key = `word-${index}`;

    if (isKeyword) {
      return (
        <span key={key} className={cn("p-1", className)}>
          {word}
        </span>
      );
    }

    return (
      <span key={key}>
        {word}
        {index < words.length - 1 ? " " : ""}
      </span>
    );
  });

  return {
    highlighted: <div>{newText}</div>,
    count: highlightedKeywords.size,
  };
};

const DiffEntry = (props: {
  title: string;
  old: ReactNode;
  new: ReactNode;
  highlightedCount?: number;
}) => {
  const { title, old, new: _new, highlightedCount } = props;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-center">{title}</h3>
      <div className="flex flex-col gap-5">
        {[old, _new].map((reactNode, index) => (
          <div key={index} className="flex flex-col gap-2">
            <span className="font-semibold">
              {index === 0 ? "Before" : "After"}
              {index === 1 && !!highlightedCount && (
                <span> (~{highlightedCount} keywords highlighted 🎉)</span>
              )}
            </span>
            <div
              className={cn("rounded-md p-3 clr-black", {
                "bg-[#ffdce0]": index === 0,
                "bg-[#E7FFEB]": index === 1,
              })}
            >
              {reactNode}
            </div>
          </div>
        ))}
        <Button
          text="I prefer the before version"
          className="flex-y primary sm mr-auto"
        />
      </div>
    </section>
  );
};

const CvEntry = (props: {
  isOld: boolean;
  entry: EducationEntry | EmploymentHistoryEntry;
}) => {
  const { entry, isOld } = props;

  return (
    <div className="mb-5 flex flex-col gap-3">
      <header>
        <BlurImage
          src={entry.image}
          alt="Missing image"
          height={50}
          width={50}
        />
      </header>
      <section>{entry.description}</section>
      {entry.skills && (
        <footer
          className={cn("rounded-md p-3", {
            "bg-[#ffeef0]": isOld,
            "bg-[#0A320B]": !isOld,
            "clr-white": !isOld,
          })}
        >
          <p className="font-bold">
            {isOld ? "Previous" : "Highlighted"} skills:
          </p>
          {entry.skills.map((s) => s + " ")}
        </footer>
      )}
    </div>
  );
};

export const Diff = (props: DiffProps) => {
  const { professionalSummary, employmentHistory, jobTitle, vacancy } = props;

  const keywords = [
    jobTitle.new,
    vacancy.companyName,
    vacancy.employmentType,
    vacancy.description,
    vacancy.requiredSkills,
  ];

  const { highlighted: userSummary, count: summaryHighlightedCount } =
    highlightKeywords({
      text: professionalSummary.new,
      keywords,
    });

  const { highlighted: vacancyDescription } = highlightKeywords({
    text: vacancy.description,
    keywords: professionalSummary.new.split(" "),
    className: "bg-border",
  });

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="grid h-full grid-cols-2 gap-8">
        <h1 className="col-span-2 text-center">Review changes</h1>
        <section className="min-h-full overflow-auto">
          <DiffEntry
            title="Professional Summary"
            old={professionalSummary.old}
            new={userSummary}
            highlightedCount={summaryHighlightedCount}
          />
          <DiffEntry title="Job Title" {...jobTitle} />
          <DiffEntry
            title="Employment History"
            old={employmentHistory.old.map((entry) => (
              <CvEntry key={entry.id} isOld entry={entry} />
            ))}
            new={employmentHistory.new.map((entry) => (
              <CvEntry key={entry.id} entry={entry} />
            ))}
          />
        </section>
        <section className="flex h-full flex-col gap-3 overflow-auto rounded-md border p-5">
          <header className="flex-y gap-5">
            <BlurImage
              src={vacancy.image}
              alt={vacancy.companyName}
              height={50}
              width={50}
              className="rounded-full"
            />
            <span className="text-lg">
              {vacancy.companyName} - {vacancy.jobTitle}
              <Link to={vacancy.sourceUrl} className="flex-y" newTab>
                {vacancyUI[vacancy.sourceName as keyof typeof vacancyUI].icon}
                <LiaExternalLinkAltSolid />
              </Link>
            </span>
          </header>
          <span>{vacancyDescription}</span>
          <h3>AI generated job summary</h3>
          <span>{vacancy.summary}</span>
        </section>
      </div>
    </div>
  );
};
