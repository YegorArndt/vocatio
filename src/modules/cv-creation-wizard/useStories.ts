import { useEffect, useState } from "react";
import { Falsy } from "~/types/utils";

import { api } from "~/utils";

export const stubbyStories = [
  `As a Full Stack Developer, I\'m proficiently engaged in overseeing both front-end and
  back-end operations of a project. A crucial part of my remit is to enable companies to
  seamlessly monitor their device networks.
  My expertise lies in the effective use of React Table with large data sets. This involves the
  creation and implementation of sophisticated algorithms designed to optimize various
  table functions such as filtration, search operations, and rendering.`,
  `As a Full Stack Developer at A-ADS, I utilized my skills in TypeScript, Next.js,
  TailwindCSS, to architect a robust cryptocurrency advertising platform catering to both
  publishers and advertisers. The system I developed streamlined the processes of ad
  placement, audience targeting, and campaign management, ultimately increasing user
  engagement and driving revenue growth.
  To complement this, I designed sophisticated algorithms for calculating commissions
  based on the usage of our service. These algorithms took into account various factors like
  user activity, ad performance, and market dynamics to ensure a fair and transparent
  commission structure.
  Understanding the volatile nature of cryptocurrencies, I incorporated real-time market
  data into our platform. This allowed us to adjust pricing models and strategies
  dynamically, maximizing profitability for our users and our platform.
  Additionally, I took the initiative to migrate our codebase from JavaScript to TypeScript,
  improving code maintainability and aligning with modern development standards. Further
  enhancing our platform's user engagement, I developed a blog website. This platform
  provided valuable insights and resources for the crypto advertising community, further
  solidifying A-ADS's brand authority and driving organic traffic to our main platform.
  This blend of strategic development, intricate algorithm design, and user-focused
  enhancements not only elevated A-ADS's market presence but also ensured its platform
  remained a preferred choice in the ever-evolving crypto advertising landscape.`,
];

const getStoriesFromLocalStorage = (vacancyId: string) => {
  const matchingStories = [];
  const storyKeyRegex = new RegExp(`draft-story-${vacancyId}-\\d+`);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (storyKeyRegex.test(key as string)) {
      const story = localStorage.getItem(key as string);
      if (story) {
        matchingStories.push(story);
      }
    }
  }

  return matchingStories;
};

const setStoriesToLocalStorage = (stories: string[], vacancyId: string) => {
  stories.forEach((story, index) => {
    localStorage.setItem(`draft-story-${vacancyId}-${index}`, story);
  });
};

export const useStories = (
  description: Falsy<string>,
  jobTitle: string,
  vacancyId: string
) => {
  const [stories, setStories] = useState<string[]>([]);
  const {
    mutate: getStory,
    data: story,
    isLoading,
    isError,
  } = api.gpt.getCompletion.useMutation();

  useEffect(() => {
    /**
     * No need to run if stories are already set.
     */
    if (stories.length) return;

    /**
     * If not = first load, try to get them from local storage.
     */
    const ls = getStoriesFromLocalStorage(vacancyId);
    if (ls.length) {
      setStories(ls);
      return;
    }

    /**
     * If none of the above, get them from the API.
     */
    const canFetchAndSet = !isLoading && !isError && description;
    if (!canFetchAndSet) return;

    /**
     * 1 effect iteration - no story yet, so we need to fetch one.
     */
    if (!story) {
      return getStory({
        description,
        jobTitle,
      });
    }

    /**
     * 2 effect iteration - story is fetched, so we need to set it.
     */
    const { content } = story;
    const resultStories = content ? [content] : stubbyStories;
    setStoriesToLocalStorage(resultStories, vacancyId);
    setStories(resultStories);
  }, [story]);

  return {
    stories,
    setStories,
    isLoading,
    isError,
    refetch: () => {
      setStories([]);
      localStorage.removeItem("stories");
    },
  };
};
