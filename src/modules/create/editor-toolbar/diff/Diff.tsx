// import cn from "classnames";

// import { type PropsWithChildren, type ReactNode } from "react";
// import { LiaExternalLinkAltSolid } from "react-icons/lia";

// import { BlurImage } from "~/components";
// import { vacancyUI } from "../../../vacancies/constants";
// import { Link } from "~/components/ui/buttons/Link";
// import {
//   AccordionTrigger,
//   Accordion,
//   AccordionItem,
//   AccordionContent,
// } from "~/components/ui/external/Accordion";
// import { ExperienceEntry } from "@prisma/client";
// import { AFTER_GREEN, BEFORE_RED } from "~/modules/constants";
// import { stripHtmlTags } from "~/modules/utils";
// import { useGeneratedData } from "~/hooks/useGeneratedData";
// import { Badge } from "~/components/ui/external/Badge";
// import { GeneratedData } from "~/modules/init-gen/types";
// import { api } from "~/utils";

// const { log } = console;

// type TopLeftProps = {
//   professionalSummary: {
//     old: string;
//     new: ReactNode;
//     count: number;
//   };
//   jobTitle: {
//     old: string;
//     new: string;
//   };
// };

// type TopRightProps = {
//   highlightedDescription: ReactNode;
// };

// type HighlightKeywordsProps = {
//   text: string;
//   keywords: string[];
//   className?: string;
// };

// type EntryProps = PropsWithChildren<{
//   count: number;
//   description: ReactNode;
//   className?: string;
//   leftOut: string[];
// }> &
//   Partial<ExperienceEntry>;

// const ignoreList = new Set([
//   "I",
//   "the",
//   "and",
//   "in",
//   "of",
//   "to",
//   "a",
//   "an",
//   "about",
//   "at",
//   "is",
//   "for",
//   "on",
//   "with",
//   "as",
//   "by",
//   "was",
//   "that",
//   "were",
//   "are",
//   "have",
//   "from",
//   "like",
//   "will",
//   "be",
//   "which",
//   "but",
//   "this",
//   "I",
// ]);

// const getInterleaved = (
//   experience: {
//     new: GeneratedData["generatedExperience"];
//     old: ExperienceEntry[];
//   },
//   keywords: string[]
// ) => {
//   let newHighlightedCount = 0;

//   const withHighlights = experience.new.map((entry, index) => {
//     const currentCount = highlightKeywords({
//       // @ts-ignore
//       text: stripHtmlTags(entry.description),
//       keywords,
//     }).count;
//     newHighlightedCount += currentCount;

//     const oldDescription = experience.old[index]?.description || "";
//     // @ts-ignore
//     const newDescription = stripHtmlTags(entry.generatedDescription.join("\n"));

//     // Function to extract capitalized words
//     const getCapitalizedWords = (text: string) => {
//       return text.match(/\b[A-Z][a-z]*\b/g) || [];
//     };

//     const oldWords = oldDescription
//       .split(/\b\s+/)
//       .map((word) => word.toLowerCase());
//     const newCapitalizedWords = new Set(
//       getCapitalizedWords(newDescription).map((word) => word.toLowerCase())
//     );

//     // Function to check if sentence has at least 3 words
//     const isValidSentence = (sentence: string) => {
//       return sentence.trim().split(/\s+/).length >= 3;
//     };

//     // Get 'leftOut' sentences
//     const leftOut = oldDescription
//       .split(".")
//       .map((sentence) => sentence.trim())
//       .filter(
//         (sentence) =>
//           isValidSentence(sentence) &&
//           !sentence
//             .split(/\s+/)
//             .some((word) => newCapitalizedWords.has(word.toLowerCase()))
//       )
//       .join(".")
//       .trim();

//     return {
//       ...entry,
//       original: experience.old[index]?.description,
//       description: highlightKeywords({
//         text: newDescription,
//         keywords,
//       }).highlighted,
//       count: currentCount,
//       leftOut:
//         leftOut.length > 0
//           ? leftOut.split(".").map((sentence) => sentence.trim())
//           : [],
//     };
//   });

//   const copy = { ...experience, new: withHighlights };

//   const interleaved = [];

//   for (let i = 0; i < copy.old.length; i++) {
//     interleaved.push(copy.old[i]);
//     interleaved.push(copy.new[i]);
//   }

//   return { interleaved, newHighlightedCount };
// };

// const highlightKeywords = (props: HighlightKeywordsProps) => {
//   const { text, keywords, className = "bg-[#C7FBD5]" } = props;
//   // Splitting text into words
//   const words = text.split(" ");
//   const splitKeywords = keywords
//     .filter(Boolean)
//     .map((keyword) => keyword.split(" "))
//     .flat();

//   const highlightedKeywords = [];
//   const newText = words.map((word, index) => {
//     const isKeyword = splitKeywords.some((kw) => {
//       const kwLower = kw.toLowerCase();
//       const wordLower = word.toLowerCase();

//       const match =
//         (kwLower === wordLower || kwLower.includes(wordLower)) &&
//         !ignoreList.has(wordLower);

//       if (match) highlightedKeywords.push(wordLower);

//       return match;
//     });

//     if (isKeyword) {
//       return (
//         <span key={index} className={cn("p-1", className)}>
//           {word}
//         </span>
//       );
//     }

//     return (
//       <span key={index}>
//         {word}
//         {index < words.length - 1 ? " " : ""}
//       </span>
//     );
//   });

//   return {
//     highlighted: <div>{newText}</div>,
//     count: highlightedKeywords.length,
//   };
// };

// const HighlightedCount = (props: { text: string; className?: string }) => {
//   const { text, className } = props;

//   return <div className={className}>{text}</div>;
// };

// const TopLeft = (props: TopLeftProps) => {
//   const { professionalSummary, jobTitle } = props;

//   return (
//     <section>
//       <h3>Professional Summary</h3>
//       <div className="mt-3 flex flex-col gap-2">
//         <span>Before</span>
//         <div className={`rounded-md ${BEFORE_RED} p-3 clr-black`}>
//           <p>{professionalSummary.old}</p>
//         </div>
//       </div>
//       <div className="mt-3 flex flex-col gap-2">
//         <span className="flex-y gap-1">
//           After
//           <HighlightedCount
//             text={`~${professionalSummary.count} keywords included 🎉`}
//           />
//         </span>
//         <div className={`${AFTER_GREEN} rounded-md p-3`}>
//           <p>{professionalSummary.new}</p>
//         </div>
//       </div>

//       <h3 className="mt-5">Job Title</h3>
//       <div className="flex flex-col gap-2">
//         <span className="mt-3">Before</span>
//         <div className={`rounded-md ${BEFORE_RED} p-3 clr-black`}>
//           <p>{jobTitle.old}</p>
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <span className="mt-3">After</span>
//         <div className={`rounded-md ${AFTER_GREEN} p-3 clr-black`}>
//           <p>{jobTitle.new}</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// const TopRight = (props: TopRightProps) => {
//   const { highlightedDescription } = props;
//   const { generated } = useGeneratedData();

//   if (!generated?.vacancy) return null;

//   const { vacancy, vacancySkills, vacancyResponsibilities, generatedSkills } =
//     generated!;

//   return (
//     <section className="flex h-full flex-col gap-3 overflow-auto rounded-md border p-5">
//       <header className="flex-y gap-5">
//         {vacancy.image && (
//           <BlurImage
//             src={vacancy.image}
//             alt={vacancy.companyName ?? "Company logo"}
//             height={50}
//             width={50}
//             className="rounded-full"
//           />
//         )}
//         <span className="flex-y gap-3 text-lg">
//           {vacancy.companyName} - {vacancy.jobTitle}
//           <Link to={vacancy.sourceUrl} className="flex-y gap-1 clr-blue" newTab>
//             Source
//             {vacancyUI[vacancy.sourceName as keyof typeof vacancyUI]?.icon}
//             <LiaExternalLinkAltSolid />
//           </Link>
//         </span>
//       </header>
//       <span>{highlightedDescription}</span>
//       <h3>Required skills:</h3>
//       <div className="flex-y flex-wrap gap-2">
//         {vacancySkills.map((skill) => (
//           <span key={skill} className="rounded-md bg-card p-3">
//             {skill}
//           </span>
//         ))}
//       </div>
//       <h3>Requirements, responsibilities, benefits:</h3>
//       <ul className="flex list-disc flex-col gap-2 pl-5">
//         {vacancyResponsibilities.map((r) => (
//           <li key={r}>{r}</li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// const Entry = (props: EntryProps) => {
//   const { count, leftOut, description, children, image, place, className } =
//     props;
//   const isAfter = typeof description !== "string";

//   return (
//     <section className={cn("mb-5 flex flex-col gap-3")}>
//       <span className="flex-y gap-2">
//         {isAfter ? "After" : "Before"}
//         {isAfter && (
//           <HighlightedCount text={`~${count} keywords included 🎉`} />
//         )}
//       </span>
//       <div className={className}>
//         <header className="flex-y gap-2 font-semibold">
//           {image && (
//             <BlurImage src={image} alt="Missing image" height={50} width={50} />
//           )}
//           <span className="text-lg">{place}</span>
//         </header>
//         <section>{description}</section>
//         {children}
//       </div>
//       {isAfter && (
//         <Accordion type="single" collapsible>
//           <AccordionItem value="i">
//             <header className="flex-y gap-2">
//               <AccordionTrigger className="gap-2">
//                 <span className="text-sm font-semibold">
//                   🙀 See what&apos;s left out (not precise yet)
//                 </span>
//               </AccordionTrigger>
//             </header>
//             <AccordionContent className="rounded-md bg-card p-2">
//               {leftOut.map((sentence, index) => (
//                 <div key={sentence}>
//                   {index + 1}. &nbsp;{sentence.trim()}
//                 </div>
//               ))}
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>
//       )}
//     </section>
//   );
// };

// export const Diff = () => {
//   const { generated } = useGeneratedData();
//   const { data: user } = api.users.get.useQuery();

//   if (!generated?.vacancy || !user) return null;

//   const {
//     vacancy,
//     generatedProfessionalSummary,
//     generatedExperience,
//     generatedSkills,
//   } = generated!;

//   const keywords = [vacancy.description, vacancy.requiredSkills] as string[];

//   const { highlighted: summaryHighlighted, count: summaryCount } =
//     highlightKeywords({
//       text: stripHtmlTags(generatedProfessionalSummary!),
//       keywords,
//     });

//   const { highlighted: vacancyHighlighted, count: vacancyCount } =
//     highlightKeywords({
//       text: vacancy.description!,
//       keywords: user.professionalSummary!.split(" "),
//       className: "bg-border",
//     });

//   const { interleaved, newHighlightedCount } = getInterleaved(
//     {
//       new: generatedExperience!,
//       old: user.experience,
//     },
//     keywords
//   );

//   return (
//     <div className="flex h-full flex-col gap-8 overflow-auto">
//       <div className="flex flex-col gap-2">
//         <h1 className="flex-center gap-2">
//           Review changes <Badge>Beta</Badge>
//         </h1>
//         <HighlightedCount
//           text={`A total of ~${
//             newHighlightedCount +
//             summaryCount +
//             vacancyCount +
//             generated?.generatedSkills.length!
//           } keywords included 🎉`}
//           className="ml-5 pb-7 text-center text-lg"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <TopLeft
//           professionalSummary={{
//             old: user.professionalSummary!,
//             new: summaryHighlighted,
//             count: summaryCount,
//           }}
//           jobTitle={{
//             old: user.jobTitle!,
//             new: vacancy.jobTitle!,
//           }}
//         />
//         <TopRight highlightedDescription={vacancyHighlighted} />

//         <section className="col-span-2 my-5 grid grid-cols-2 gap-3">
//           <h3 className="col-span-2">Skills</h3>
//           <div className="flex flex-col gap-2">
//             <span>Before</span>
//             <div className={cn("rounded-md p-3 clr-black", BEFORE_RED)}>
//               <p>{user.skills.map((x) => x.name).join(" • ")}</p>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             <span>
//               After: {generatedSkills!.length} generated based on your skills 🎉
//             </span>
//             <div className={cn("rounded-md p-3 clr-black", AFTER_GREEN)}>
//               <span className="flex-y flex-wrap gap-2">
//                 {generatedSkills!.map((skill) => (
//                   <span key={skill.id} className="rounded-md bg-[#C7FBD5] p-1">
//                     {skill.name}
//                   </span>
//                 ))}
//               </span>
//             </div>
//           </div>
//         </section>

//         <h3 className="col-span-2 mt-5">Experience</h3>
//         {interleaved.map(
//           (entry, index) =>
//             !!entry && (
//               <Entry
//                 key={entry.id}
//                 {...(entry as EntryProps)}
//                 className={cn({
//                   [AFTER_GREEN]: index % 2 === 1,
//                   [BEFORE_RED]: index % 2 === 0,
//                 })}
//               />
//             )
//         )}
//       </div>
//     </div>
//   );
// };
