import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const usePostMessage = (props = { interval: 1000 }) => {
  const { interval } = props;
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const sessionToken = Cookies.get("__session");

    if (sessionToken) {
      /**
       * Send token directly to content script via postMessage (extension).
       */
      window.postMessage(
        { type: "FROM_PAGE", token: sessionToken, userId: user.id },
        "*"
      );

      /**
       * Post message every miniute to keep the session alive.
       */
      setInterval(() => {
        window.postMessage(
          { type: "FROM_PAGE", token: sessionToken, userId: user.id },
          "*"
        );
      }, interval);
    }

    /**
     * Remove interval on unmount.
     */
    return () => {
      clearInterval(interval);
    };
  }, [user]);
};
