import { useState } from "react";

import type { PartialVacancy, RouterUser } from "~/modules/extension/types";

type Payload = { user: RouterUser };
type Data = { newVacancy: PartialVacancy; user: RouterUser };

type Message = {
  type: "post-user" | "get-user" | "get-vacancy";
  payload?: Payload;
};
export type ExtensionResponse = { success: boolean; data?: Data };

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
            /**
             * Assume the extension isn't installed.
             */
            setIsInstalled(false);
          }
        );
      } else {
        setIsInstalled(false);
      }
    } catch (e) {
      setIsInstalled(false);
    }
  };

  return { hasSent, sendMessage, isInstalled, response, isExpired };
};
