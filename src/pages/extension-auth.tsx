import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { MessageContainer } from "~/components/MessageContainer";

import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { api } from "~/utils";

const { log } = console;

export const useSendMessage = () => {
  const [hasSent, setHasSent] = useState(false);

  const { data: user } = api.users.get.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const sessionToken = Cookies.get("__session");

    if (!sessionToken) {
      void router.push("/login");
      return;
    }

    const extensionId = "aafhhnmdccfclebgdmndicbngcokddid";

    if (window.chrome && chrome.runtime) {
      chrome.runtime.sendMessage(extensionId, { user }, function (response) {
        if (response.success) setHasSent(true);
      });
    }
  }, [user]);

  return { hasSent };
};

const ExtensionAuth = () => {
  const { hasSent } = useSendMessage();

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
/**
 * Send token directly to content script.
 */
// window.postMessage(message);

/**
 * Post message every miniute to keep the session alive.
 */
// setInterval(() => {
//   window.postMessage(message);
// }, interval);
