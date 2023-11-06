import { useStories } from "~/modules/cv-creation-wizard/useStories";
import { Story } from "./Story";

export type TimelineProps = {
  jobDescription: string;
  jobTitle: string;
  vacancyId: string;
};

export const Timeline = (props: TimelineProps) => {
  const { jobDescription, jobTitle, vacancyId } = props;
  const { stories, isLoading } = useStories(
    jobDescription,
    jobTitle,
    vacancyId
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stories.length) {
    return <div>No stories found</div>;
  }

  return (
    <>
      {stories.map((s, index) => (
        <Story key={s} story={s} jobTitle={jobTitle} index={index} />
      ))}
    </>
  );
};