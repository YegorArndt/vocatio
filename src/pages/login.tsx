import { SignUp, useClerk, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { UserResource } from "@clerk/types";

import { useEffect } from "react";
import { api } from "~/utils";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { MessageContainer } from "~/components/MessageContainer";
import { useSettings } from "~/hooks/useSettings";
import { PopoverEvents } from "~/modules/events/types";

const { log } = console;

const PrismaLayer = (props: { clerkUser: UserResource }) => {
  const { clerkUser } = props;
  const { updateSettings } = useSettings();

  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = api.users.get.useQuery();

  const {
    mutate: createUser,
    isSuccess: successCreating,
    isLoading: creatingUser,
  } = api.users.create.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (user || successCreating) {
      successCreating &&
        updateSettings({
          hasConnectedExtension: false,
          [PopoverEvents.BOLDEN_BULLETS]: true,
          [PopoverEvents.BOLDEN_SUMMARY]: true,
        });
      void router.push("/vacancies");
      return;
    }

    /**
     * Create user
     */
    const noDbRecord = isError || (!userLoading && !user && clerkUser);

    if (noDbRecord && !creatingUser && !successCreating) {
      createUser({
        contact: [
          { name: "Email", value: clerkUser.emailAddresses[0]!.emailAddress },
        ],
        email: clerkUser.emailAddresses[0]!.emailAddress,
        image: clerkUser.imageUrl,
        name: clerkUser.fullName!,
      });
    }
  }, [user, successCreating, isError]);

  return (
    <>
      <ProgressIncrementer canFinish={!userLoading} shouldHide fixToTop />
      <main className="flex-center">
        {userLoading && (
          <MessageContainer>
            <AnimatedDiv duration={2}>
              ✨ Thank you for using Vocatio Beta
            </AnimatedDiv>
            <AnimatedDiv duration={1000}>Authorizing...</AnimatedDiv>
          </MessageContainer>
        )}
        {creatingUser && !successCreating && !user && (
          <AnimatedDiv duration={3} className="flex-y gap-2">
            <Spinner size={15} />
            Creating an account for you...
          </AnimatedDiv>
        )}
        {(successCreating || user) && (
          <AnimatedDiv duration={1000}>🎉 Success</AnimatedDiv>
        )}
      </main>
    </>
  );
};

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const hasClearedLs = isLoaded && !isSignedIn;
    if (hasClearedLs) void signOut();
  }, [isSignedIn, isLoaded]);

  const isFirstLogin = !isSignedIn && isLoaded;

  return (
    <>
      <Head>
        <title>Logging into Vocatio...</title>
      </Head>
      <div className="flex-center h-screen flex-col gap-4">
        <ProgressIncrementer canFinish={isLoaded} shouldHide fixToTop />
        {isFirstLogin && (
          <AnimatedDiv>
            <SignUp />
          </AnimatedDiv>
        )}
        {isSignedIn && <PrismaLayer clerkUser={clerkUser} />}
      </div>
    </>
  );
};

export default LoginPage;
