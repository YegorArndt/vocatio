import { useState } from "react";
import { RouterOutputs } from "~/utils/api";

const EXTENSION_ID_DEV = "aafhhnmdccfclebgdmndicbngcokddid";
const EXTENSION_ID_PROD = "bknmlolcaccbfcedimgmpnfcjadfelbn";

export const useSendMessage = () => {
  const [hasSent, setHasSent] = useState(false);
  const [isInstalled, setIsInstalled] = useState(true);

  const sendMessage = (user: RouterOutputs["users"]["get"]) => {
    const id =
      (process.env.NODE_ENV === "development"
        ? EXTENSION_ID_DEV
        : EXTENSION_ID_PROD) || EXTENSION_ID_PROD;

    if (window.chrome && chrome.runtime && !hasSent) {
      chrome.runtime.sendMessage(id, { user }, function (response) {
        if (response.success) {
          setHasSent(true);
          return;
        }
        /**
         * Assume the extension isn't installed.
         */
        setIsInstalled(false);
      });
    }
  };

  return { hasSent, sendMessage, isInstalled };
};
