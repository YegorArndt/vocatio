import cn from "classnames";
import {
  DraftEmploymentHistoryEntry,
  EmploymentHistoryEntry,
  Vacancy,
} from "@prisma/client";
import { PropsWithChildren, ReactNode } from "react";
import { BlurImage } from "~/components";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { vacancyUI } from "../vacancies/constants";
import { Link } from "~/components/ui/buttons/Link";

const { log } = console;

type TopLeftProps = {
  professionalSummary: {
    old: string;
    new: ReactNode;
    count: number;
  };
  jobTitle: {
    old: string;
    new: string;
  };
};

type TopRightProps = {
  vacancy: Vacancy;
  highlightedDescription: ReactNode;
};

type DiffProps = {
  vacancy: Vacancy;
  employmentHistory: {
    old: EmploymentHistoryEntry[];
    new: DraftEmploymentHistoryEntry[];
  };
  professionalSummary: {
    old: string;
    new: string;
    count?: number;
  };
  jobTitle: {
    old: string;
    new: string;
  };
};

type HighlightKeywordsProps = {
  text: string;
  keywords: string[];
  className?: string;
};

type EntryProps = PropsWithChildren<{
  count: number;
  description: ReactNode;
  className?: string;
}> &
  Partial<EmploymentHistoryEntry>;

const beforeRed = "bg-[#ffdce0] clr-black rounded-md p-3";
const afterGreen = "bg-[#E7FFEB] clr-black rounded-md p-3";

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
  "was",
  "that",
  "were",
  "are",
  "have",
  "from",
  "like",
  "will",
  "be",
  "which",
]);

const getInterleaved = (
  employmentHistory: {
    new: DraftEmploymentHistoryEntry[];
    old: EmploymentHistoryEntry[];
  },
  keywords: string[]
) => {
  let newHighlightedCount = 0;

  const withHighlights = employmentHistory.new.map((entry) => {
    const currentCount = highlightKeywords({
      text: entry.description,
      keywords,
    }).count;
    newHighlightedCount += currentCount;

    return {
      ...entry,
      description: highlightKeywords({
        text: entry.description,
        keywords,
      }).highlighted,
      count: currentCount,
    };
  });

  const copy = { ...employmentHistory, new: withHighlights };

  const interleaved = [];

  for (let i = 0; i < copy.old.length; i++) {
    interleaved.push(copy.old[i]);
    interleaved.push(copy.new[i]);
  }

  return { interleaved, newHighlightedCount };
};

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
      if (match) highlightedKeywords.add(word.toLowerCase());

      return match;
    });

    if (isKeyword) {
      return (
        <span key={index} className={cn("p-1", className)}>
          {word}
        </span>
      );
    }

    return (
      <span key={index}>
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

const HighlightedCount = (props: {
  count: number;
  what?: string;
  className?: string;
}) => {
  const { count, what = "keywords", className } = props;

  return (
    count > 0 && (
      <div className={className}>
        &nbsp;(~{count} {what} highlighted 🎉)
      </div>
    )
  );
};

const TopLeft = (props: TopLeftProps) => {
  const { professionalSummary, jobTitle } = props;

  return (
    <section>
      <h3>Professional Summary</h3>
      <div className="mt-3 flex flex-col gap-2">
        <span>Before</span>
        <div className={`rounded-md ${beforeRed} p-3 clr-black`}>
          <p>{professionalSummary.old}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <span className="flex-y gap-1">
          After
          <HighlightedCount count={professionalSummary.count} />
        </span>
        <div className={`${afterGreen} rounded-md p-3`}>
          <p>{professionalSummary.new}</p>
        </div>
      </div>

      <h3 className="mt-5">Job Title</h3>
      <div className="flex flex-col gap-2">
        <span className="mt-3">Before</span>
        <div className={`rounded-md ${beforeRed} p-3 clr-black`}>
          <p>{jobTitle.old}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="mt-3">After</span>
        <div className={`rounded-md ${afterGreen} p-3 clr-black`}>
          <p>{jobTitle.new}</p>
        </div>
      </div>
    </section>
  );
};

const TopRight = (props: TopRightProps) => {
  const { vacancy, highlightedDescription } = props;

  return (
    <section className="flex h-full flex-col gap-3 overflow-auto rounded-md border p-5">
      <header className="flex-y gap-5">
        {vacancy.image && (
          <BlurImage
            src={vacancy.image}
            alt={vacancy.companyName ?? "Company logo"}
            height={50}
            width={50}
            className="rounded-full"
          />
        )}
        <span className="text-lg">
          {vacancy.companyName} - {vacancy.jobTitle}
          <Link to={vacancy.sourceUrl} className="flex-y" newTab>
            {vacancyUI[vacancy.sourceName as keyof typeof vacancyUI].icon}
            <LiaExternalLinkAltSolid />
          </Link>
        </span>
      </header>
      <span>{highlightedDescription}</span>
      <h3>AI generated job summary</h3>
      <span>{vacancy.summary}</span>
    </section>
  );
};

const Entry = (props: EntryProps) => {
  const { count, description, children, image, place, className } = props;
  const isAfter = typeof description !== "string";

  return (
    <section className={cn("mb-5 flex flex-col gap-3")}>
      <span className="flex-y gap-2">
        {isAfter ? "After" : "Before"}
        {isAfter && <HighlightedCount count={count} />}
      </span>
      <div className={className}>
        <header className="flex-y gap-2 font-semibold">
          {image && (
            <BlurImage src={image} alt="Missing image" height={50} width={50} />
          )}
          <span className="text-lg">{place}</span>
        </header>
        <section>{description}</section>
        {children}
      </div>
    </section>
  );
};

export const Diff = (props: DiffProps) => {
  const { vacancy, professionalSummary, employmentHistory, jobTitle } = props;
  const keywords = [vacancy.description, vacancy.requiredSkills];

  const { highlighted: summaryHighlighted, count: summaryCount } =
    highlightKeywords({
      text: professionalSummary.new,
      keywords,
    });

  const { highlighted: vacancyHighlighted, count: vacancyCount } =
    highlightKeywords({
      text: vacancy.description,
      keywords: professionalSummary.new.split(" "),
      className: "bg-border",
    });

  const { interleaved, newHighlightedCount } = getInterleaved(
    employmentHistory,
    keywords
  );

  return (
    <div className="flex h-full flex-col gap-8 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-center">Review changes</h1>
        <HighlightedCount
          count={newHighlightedCount + summaryCount + vacancyCount}
          what="total keywords"
          className="ml-5 pb-7 text-center text-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TopLeft
          professionalSummary={{
            ...professionalSummary,
            new: summaryHighlighted,
            count: summaryCount,
          }}
          jobTitle={jobTitle}
        />
        <TopRight
          vacancy={vacancy}
          highlightedDescription={vacancyHighlighted}
        />
        <h3 className="col-span-2 mt-5">Employment History</h3>
        {interleaved.map((entry, index) => (
          <Entry
            key={entry!.id}
            {...(entry as EntryProps)}
            className={cn({
              [afterGreen]: index % 2 === 1,
              [beforeRed]: index % 2 === 0,
            })}
          />
        ))}
      </div>
    </div>
  );
};
