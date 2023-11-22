// import { useEffect, useState } from "react";
// import cn from "classnames";

// import { api } from "~/utils";
// import { Story } from "./Story";
// import { Button } from "~/components/ui/buttons/Button";
// import { useDraftContext } from "~/modules/draft/DraftContext";
// import { Timeline as TimelineProps } from "~/modules/draft/types";
// import { baseStories } from "./constants";

// type LsStories = {
//   id: string;
//   story: string;
// };
// export type Timeline = {
//   storyType: StoryType;
//   jobDescription: string;
//   jobTitle: string;
//   vacancyId: string;
//   className?: string;
// };

// const getStoriesFromLs = (vacancyId: string) => {
//   const storyKeyRegex = new RegExp(`^draft-story-${vacancyId}-(?!\\d+$).+`);
//   let stories: LsStories[] = [];

//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     if (typeof key === "string" && storyKeyRegex.test(key)) {
//       stories.push({ id: key, story: localStorage.getItem(key) ?? "" });
//     }
//   }

//   stories = stories.length ? stories : baseStories;

//   return stories;
// };

// export const Timeline = (props: TimelineProps) => {
//   const { jobDescription, jobTitle, vacancyId, storyType, className } = props;

//   const [stories, setStories] = useState<LsStories[]>(
//     getStoriesFromLs(vacancyId)
//   );

//   const { mutate, data, isLoading } = api.gpt.getCompletion.useMutation();

//   const {
//     draftState: { DOWNLOAD_FIRED, CHANGE_DESIGN_FIRED },
//   } = useDraftContext();

//   useEffect(() => {
//     if (!data) return;

//     const { story, companyName } = data;

//     setStories((stories) => [
//       ...stories,
//       {
//         id: `draft-story-${vacancyId}-${companyName}`,
//         story: story.content ?? "",
//       },
//     ]);
//   }, [data]);

//   return (
//     <div className={cn(className, "mb-5")}>
//       {stories.map(
//         ({ story, id }, index) =>
//           Boolean(index < 2) && (
//             <Story
//               key={id}
//               id={id}
//               story={story}
//               index={index}
//               jobTitle={jobTitle}
//               storyType={storyType}
//             />
//           )
//       )}
//       {!DOWNLOAD_FIRED && !CHANGE_DESIGN_FIRED && (
//         <footer className="mt-2">
//           {stories.length < 2 ? (
//             <Button
//               className="sm common border"
//               onClick={() =>
//                 mutate({
//                   jobDescription,
//                   jobTitle,
//                 })
//               }
//               disabled={isLoading}
//             >
//               {isLoading ? "🐈 Loading..." : "✨✨✨ Generate ✨✨✨"}
//             </Button>
//           ) : null}
//         </footer>
//       )}
//     </div>
//   );
// };
