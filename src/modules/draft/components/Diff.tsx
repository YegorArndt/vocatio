import cn from "classnames";
import {
  DraftEmploymentHistoryEntry,
  EmploymentHistoryEntry,
  Vacancy,
} from "@prisma/client";
import { PropsWithChildren, ReactNode } from "react";
import { BlurImage } from "~/components";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { vacancyUI } from "../../vacancies/constants";
import { Link } from "~/components/ui/buttons/Link";
import { useDraftContext } from "../DraftContext";
import { RouterOutputs } from "~/utils/api";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { AccordionTrigger } from "~/components/external/Accordion";

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
  leftOut: string[];
}> &
  Partial<EmploymentHistoryEntry>;

const beforeRed = "bg-[#ffdce0] clr-black rounded-md p-3";
const afterGreen = "bg-[#E7FFEB] clr-black rounded-md p-3";

const ignoreList = new Set([
  "I",
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
  "but",
  "this",
  "I",
]);

const getInterleaved = (
  employmentHistory: {
    new: DraftEmploymentHistoryEntry[];
    old: EmploymentHistoryEntry[];
  },
  keywords: string[]
) => {
  let newHighlightedCount = 0;

  const withHighlights = employmentHistory.new.map((entry, index) => {
    const currentCount = highlightKeywords({
      text: entry.description,
      keywords,
    }).count;
    newHighlightedCount += currentCount;

    const oldDescription = employmentHistory.old[index]?.description || "";
    const newDescription = entry.description;

    // Function to extract capitalized words
    const getCapitalizedWords = (text: string) => {
      return text.match(/\b[A-Z][a-z]*\b/g) || [];
    };

    const oldWords = oldDescription
      .split(/\b\s+/)
      .map((word) => word.toLowerCase());
    const newCapitalizedWords = new Set(
      getCapitalizedWords(newDescription).map((word) => word.toLowerCase())
    );

    // Function to check if sentence has at least 3 words
    const isValidSentence = (sentence: string) => {
      return sentence.trim().split(/\s+/).length >= 3;
    };

    // Get 'leftOut' sentences
    const leftOut = oldDescription
      .split(".")
      .map((sentence) => sentence.trim())
      .filter(
        (sentence) =>
          isValidSentence(sentence) &&
          !sentence
            .split(/\s+/)
            .some((word) => newCapitalizedWords.has(word.toLowerCase()))
      )
      .join(".")
      .trim();

    return {
      ...entry,
      original: employmentHistory.old[index]?.description,
      description: highlightKeywords({
        text: entry.description,
        keywords,
      }).highlighted,
      count: currentCount,
      leftOut:
        leftOut.length > 0
          ? leftOut.split(".").map((sentence) => sentence.trim())
          : [],
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

  const highlightedKeywords = [];
  const newText = words.map((word, index) => {
    const isKeyword = splitKeywords.some((kw) => {
      const kwLower = kw.toLowerCase();
      const wordLower = word.toLowerCase();

      const match =
        (kwLower === wordLower || kwLower.includes(wordLower)) &&
        !ignoreList.has(wordLower);

      if (match) highlightedKeywords.push(wordLower);

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
    count: highlightedKeywords.length,
  };
};

const HighlightedCount = (props: { text: string; className?: string }) => {
  const { text, className } = props;

  return <div className={className}>{text}</div>;
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
          <HighlightedCount
            text={`~${professionalSummary.count} keywords included 🎉`}
          />
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
            {vacancyUI[vacancy.sourceName as keyof typeof vacancyUI]?.icon}
            <LiaExternalLinkAltSolid />
          </Link>
        </span>
      </header>
      <span>{highlightedDescription}</span>
      <h3>AI generated job summary</h3>
      <span>
        {vacancy.summary ||
          "None 😿. Perhaps the vacancy was created manually?"}
      </span>
    </section>
  );
};

const Entry = (props: EntryProps) => {
  const { count, leftOut, description, children, image, place, className } =
    props;
  const isAfter = typeof description !== "string";

  return (
    <section className={cn("mb-5 flex flex-col gap-3")}>
      <span className="flex-y gap-2">
        {isAfter ? "After" : "Before"}
        {isAfter && (
          <HighlightedCount text={`~${count} keywords included 🎉`} />
        )}
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
      {isAfter && (
        <Accordion type="single" collapsible>
          <AccordionItem value="i">
            <header className="flex-y gap-2">
              <AccordionTrigger className="gap-2">
                <span className="text-sm font-semibold">
                  🙀 See what&apos;s left out (not precise yet)
                </span>
              </AccordionTrigger>
            </header>
            <AccordionContent className="rounded-md bg-card p-2">
              {leftOut.map((sentence, index) => (
                <div>
                  {index + 1}. &nbsp;{sentence.trim()}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </section>
  );
};

export const Diff = (props: {
  vacancy: Vacancy;
  user: RouterOutputs["users"]["get"];
}) => {
  const { vacancy, user } = props;
  const { draft } = useDraftContext();

  const keywords = [vacancy!.description, vacancy!.requiredSkills] as string[];

  const { highlighted: summaryHighlighted, count: summaryCount } =
    highlightKeywords({
      text: draft.professionalSummary,
      keywords,
    });

  const { highlighted: vacancyHighlighted, count: vacancyCount } =
    highlightKeywords({
      text: vacancy!.description!,
      keywords: user!.professionalSummary!.split(" "),
      className: "bg-border",
    });

  const { interleaved, newHighlightedCount } = getInterleaved(
    {
      new: draft.employmentHistory as DraftEmploymentHistoryEntry[],
      old: user!.employmentHistory,
    },
    keywords
  );

  return (
    <div className="flex h-full flex-col gap-8 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-center">Review changes</h1>
        <HighlightedCount
          text={`A total of ~${
            newHighlightedCount + summaryCount + vacancyCount
          } keywords included 🎉`}
          className="ml-5 pb-7 text-center text-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TopLeft
          professionalSummary={{
            old: user!.professionalSummary!,
            new: summaryHighlighted,
            count: summaryCount,
          }}
          jobTitle={{ old: user!.jobTitle!, new: draft.jobTitle! }}
        />
        <TopRight
          vacancy={vacancy}
          highlightedDescription={vacancyHighlighted}
        />
        <h3 className="col-span-2 mt-5">Employment History</h3>
        {interleaved.map(
          (entry, index) =>
            !!entry && (
              <Entry
                key={entry.id}
                {...(entry as EntryProps)}
                className={cn({
                  [afterGreen]: index % 2 === 1,
                  [beforeRed]: index % 2 === 0,
                })}
              />
            )
        )}
      </div>
    </div>
  );
};