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
      const message = {
        type: "linkedin",
        token: sessionToken,
        password: process.env.NEXT_PUBLIC_EXTENSION_PASSWORD,
        user,
      };

      /**
       * Send token directly to content script via postMessage (extension).
       */
      window.postMessage(message);

      /**
       * Post message every miniute to keep the session alive.
       */
      setInterval(() => {
        window.postMessage(message);
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
