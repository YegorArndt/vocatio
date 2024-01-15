import Head from "next/head";
import { useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdArrowRightAlt } from "react-icons/md";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { MessageContainer } from "~/components/MessageContainer";

import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { Link } from "~/components/ui/buttons/Link";
import { extensionUrl } from "~/constants";
import { usePersistantData } from "~/hooks/usePersistantData";
import { RouterOutputs, api } from "~/utils/api";

const { log } = console;

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

    if (window.chrome && chrome.runtime) {
      chrome.runtime.sendMessage(id, { user }, function (response) {
        if (response.success) {
          setHasSent(true);
          return;
        }
        setIsInstalled(false);
      });
    }

    setIsInstalled(hasSent);
  };

  return { hasSent, sendMessage, isInstalled };
};

const ExtensionAuth = () => {
  const { hasSent, sendMessage, isInstalled } = useSendMessage();
  const { data: user } = api.users.get.useQuery();
  const { updateData } = usePersistantData();

  useEffect(() => {
    if (user) sendMessage(user);
  }, [user]);

  return (
    <>
      <Head>
        <title>{hasSent ? "Success" : "Connecting the extension..."}</title>
      </Head>
      <ProgressIncrementer
        incrementBy={13}
        canFinish={hasSent || !isInstalled}
        shouldHide
      />
      <main className="flex-center h-[90vh]">
        {!isInstalled && (
          <AnimatedDiv className="flex-center flex-col gap-3">
            Coudn&apos;t connect to the extension. Have you installed it?
            <Link
              text="Install from Chrome Web Store"
              endIcon={<HiOutlineExternalLink />}
              to={extensionUrl}
              newTab
              className="flex-y clr-blue"
            />
          </AnimatedDiv>
        )}
        {!hasSent && isInstalled && (
          <MessageContainer>
            <AnimatedDiv duration={3}>
              ✨ Thank you for using Vocatio Beta
            </AnimatedDiv>
            <AnimatedDiv duration={1000}>
              Connecting the extension...
            </AnimatedDiv>
          </MessageContainer>
        )}
        {hasSent && (
          <AnimatedDiv className="flex-center flex-col gap-3">
            🎉 Success. The extension has been connected to your account.
            <Link
              text="View dashboard"
              to="/vacancies"
              className="flex-y sm rounded-md tracking-wide hover:bg-hover"
              endIcon={<MdArrowRightAlt size={20} />}
              onClick={() => {
                updateData({ hasConnectedExtension: true });
              }}
            />
          </AnimatedDiv>
        )}
      </main>
    </>
  );
};

export default ExtensionAuth;
