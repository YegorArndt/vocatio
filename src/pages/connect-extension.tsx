import Head from "next/head";
import { useEffect } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdArrowRightAlt } from "react-icons/md";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { MessageContainer } from "~/components/MessageContainer";

import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { Link } from "~/components/ui/buttons/Link";
import { useLs } from "~/hooks/useLs";
import { useSendMessage } from "~/hooks/useSendMessage";
import { extensionUrl } from "~/modules/constants";
import { api } from "~/utils/api";

const { log } = console;

const ConnectExtensionPage = () => {
  const { hasSent, sendMessage, isInstalled } = useSendMessage();
  const { data: user } = api.users.get.useQuery();
  const { updateLs } = useLs();

  useEffect(() => {
    if (user) sendMessage({ type: "post-user", payload: { user } });
  }, [user]);

  useEffect(() => {
    if (hasSent) {
      updateLs({ hasConnectedExtension: true });
    }
  }, [hasSent]);

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
              className="flex-y sm hover:main-hover rounded-md tracking-wide"
              endIcon={<MdArrowRightAlt size={20} />}
            />
          </AnimatedDiv>
        )}
      </main>
    </>
  );
};

export default ConnectExtensionPage;
