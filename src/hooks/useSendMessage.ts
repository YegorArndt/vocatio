import { useEffect, useState } from "react";
import { RouterUser, PartialVacancy } from "~/modules/types";

const { log } = console;

type ExtensionPayload = { user: RouterUser };
export type ExtensionData = { newVacancy: PartialVacancy; user: RouterUser };

type Message = {
  type: "post-user" | "get-user" | "get-vacancy";
  payload?: ExtensionPayload;
};
export type ExtensionResponse = { success: boolean; data?: ExtensionData };

const EXTENSION_ID_DEV = "aafhhnmdccfclebgdmndicbngcokddid";
const EXTENSION_ID_PROD = "bknmlolcaccbfcedimgmpnfcjadfelbn";

const EXTENSION_ID =
  (process.env.NODE_ENV === "development"
    ? EXTENSION_ID_DEV
    : EXTENSION_ID_PROD) || EXTENSION_ID_PROD;

const validateToken = (token: string) => {
  const parts = token.split("_");

  if (!parts[0]) return false;

  const expirationTime = parseInt(parts[0], 16);

  if (Date.now() < expirationTime) {
    // Token is valid, you can proceed with sending a message
    return true;
  } else {
    // Token has expired, do not send a message
    return false;
  }
};

export const useSendMessage = (props?: { expirationToken?: string | null }) => {
  const { expirationToken } = props || {};

  const [hasSent, setHasSent] = useState(false);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [response, setResponse] = useState({} as ExtensionResponse);

  const sendMessage = (message: Message) => {
    if (hasSent || isExpired) return;

    if (expirationToken && !validateToken(expirationToken)) {
      setIsExpired(true);
      return;
    }

    try {
      if (window.chrome && chrome.runtime) {
        setHasSent(true);

        chrome.runtime.sendMessage(
          EXTENSION_ID,
          message,
          (response: ExtensionResponse) => {
            if (response.success) {
              setResponse(response);
              return;
            }
          }
        );
      }
    } catch (e) {}
  };

  useEffect(() => {
    // This function will be called after 5 seconds if conditions are met
    const handleCheck = () => {
      if (hasSent && !response.success && isInstalled) {
        setIsInstalled(false);
      }
    };

    // Set up a timer to execute handleCheck after 5 seconds
    const timer = setTimeout(() => {
      handleCheck();
    }, 5000);

    // Clear the timer if the component unmounts or if any dependencies change
    // This is important to avoid memory leaks or state updates on unmounted components
    return () => clearTimeout(timer);
  }, [hasSent, response.success, isInstalled]);

  return { hasSent, sendMessage, isInstalled, response, isExpired };
};
