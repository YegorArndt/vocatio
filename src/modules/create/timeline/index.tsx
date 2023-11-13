import { useEffect, useState } from "react";
import { api } from "~/utils";
import { Story } from "./Story";
import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { Timeline as TimelineProps } from "~/modules/draft/types";

type LsStories = {
  id: string;
  story: string;
};

const getStoriesFromLs = (vacancyId: string) => {
  const storyKeyRegex = new RegExp(`^draft-story-${vacancyId}-(?!\\d+$).+`);
  const stories: LsStories[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (typeof key === "string" && storyKeyRegex.test(key)) {
      stories.push({ id: key, story: localStorage.getItem(key) ?? "" });
    }
  }

  return stories.reverse();
};

export const Timeline = (props: TimelineProps) => {
  const { jobDescription, jobTitle, vacancyId, styles } = props;
  const [stories, setStories] = useState<LsStories[]>(
    getStoriesFromLs(vacancyId)
  );

  const { mutate, data, isLoading } = api.gpt.getCompletion.useMutation();

  const {
    draftState: { DOWNLOAD_FIRED },
  } = useDraftContext();

  useEffect(() => {
    if (!data) return;

    const { story, companyName } = data;

    setStories((stories) => [
      ...stories,
      {
        id: `draft-story-${vacancyId}-${companyName}`,
        story: story.content ?? "",
      },
    ]);
  }, [data]);

  const { timelineClassNames, ...storyStyles } = styles;

  return (
    <div className={timelineClassNames}>
      {stories.map(({ story, id }, index) => (
        <Story
          key={id}
          id={id}
          story={story}
          index={index}
          jobTitle={jobTitle}
          styles={storyStyles}
        />
      ))}
      {!DOWNLOAD_FIRED && (
        <footer className="mt-2">
          {stories.length < 2 ? (
            <Button
              className="sm common border"
              onClick={() =>
                mutate({
                  jobDescription,
                  jobTitle,
                })
              }
              disabled={isLoading}
            >
              {isLoading ? "🐈 Loading..." : "✨✨✨ Generate ✨✨✨"}
            </Button>
          ) : (
            "Maximum 2 stories"
          )}
        </footer>
      )}
    </div>
  );
};
