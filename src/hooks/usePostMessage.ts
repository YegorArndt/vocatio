import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clerkAuth } from "~/constants";
import { api } from "~/utils";

const { log } = console;

export const usePostMessage = (props = { interval: 1000 }) => {
  const { interval } = props;
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const sessionToken = Cookies.get("__session");

    if (sessionToken) {
      const missingSections: (keyof typeof user)[] = [];
      const sections: (keyof typeof user)[] = [
        "employmentHistory",
        "education",
        "skills",
        "languages",
      ];

      sections.forEach((section) => {
        const sectionArray = user[section] as [];
        if (sectionArray.length === 0) {
          missingSections.push(section);
        }
      });

      const message = {
        type: "FROM_PAGE",
        token: sessionToken,
        userId: user.id,
        userName: user.name,
        linkedin: user.contact?.linkedin,
        userImage: user.image,
        userJobTitle: user.jobTitle,
        vacanciesCount: user.vacancies.length,
        missingSections,
      };

      /**
       * Send token directly to content script via postMessage (extension).
       */
      window.postMessage(message, "*");

      /**
       * Post message every miniute to keep the session alive.
       */
      setInterval(() => {
        window.postMessage(message, "*");
      }, interval);
    } else {
      void router.push(clerkAuth);
    }

    /**
     * Remove interval on unmount.
     */
    return () => {
      clearInterval(interval);
    };
  }, [user]);
};
