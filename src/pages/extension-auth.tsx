import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { MessageContainer } from "~/components/MessageContainer";

import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { RouterOutputs, api } from "~/utils/api";

const { log } = console;

const EXTENSION_ID_DEV = "aafhhnmdccfclebgdmndicbngcokddid";
const EXTENSION_ID_PROD = "bknmlolcaccbfcedimgmpnfcjadfelbn";

export const useSendMessage = () => {
  const [hasSent, setHasSent] = useState(false);

  const sendMessage = (user: RouterOutputs["users"]["get"]) => {
    const id =
      (process.env.NODE_ENV === "development"
        ? EXTENSION_ID_DEV
        : EXTENSION_ID_PROD) || EXTENSION_ID_PROD;

    try {
      if (window.chrome && chrome.runtime) {
        chrome.runtime.sendMessage(id, { user }, function (response) {
          if (response.success) setHasSent(true);
        });
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return { hasSent, sendMessage };
};

const ExtensionAuth = () => {
  const { hasSent, sendMessage } = useSendMessage();
  const { data: user } = api.users.get.useQuery();

  useEffect(() => {
    if (user) sendMessage(user);
  }, [user]);

  return (
    <>
      <Head>
        <title>{hasSent ? "Success" : "Logging you in"}</title>
      </Head>
      <ProgressIncrementer incrementBy={13} canFinish={hasSent} shouldHide />
      <main className="flex-center h-[90vh]">
        {!hasSent && (
          <MessageContainer>
            <AnimatedDiv duration={2}>✨ Thanks for using Vocatio</AnimatedDiv>
            <AnimatedDiv duration={1000}>Logging you in...</AnimatedDiv>
          </MessageContainer>
        )}
        {hasSent && (
          <AnimatedDiv>
            🎉 Success. The extension should work in a minute.
          </AnimatedDiv>
        )}
      </main>
    </>
  );
};

export default ExtensionAuth;
