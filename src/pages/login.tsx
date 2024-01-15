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

const { log } = console;

const PrismaLayer = (props: { clerkUser: UserResource }) => {
  const { clerkUser } = props;

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
    if ((user && !userLoading) || successCreating)
      void router.push("/vacancies");

    /**
     * Create user
     */
    const noDbRecord = isError || (!userLoading && !user && clerkUser);

    if (noDbRecord) {
      createUser({
        name: clerkUser.fullName!,
        image: clerkUser.imageUrl,
        contact: {
          email: clerkUser.emailAddresses[0]!.emailAddress,
        },
      });
    }
  }, [user, successCreating, isError]);

  return (
    <>
      <ProgressIncrementer canFinish={!userLoading} shouldHide />
      {userLoading && (
        <MessageContainer>
          <AnimatedDiv duration={2}>
            🎉 Thank you for using Vocatio Beta
          </AnimatedDiv>
          <AnimatedDiv duration={1000}>Authorizing...</AnimatedDiv>
        </MessageContainer>
      )}
      {creatingUser && (
        <AnimatedDiv duration={3} className="flex-y gap-2">
          <Spinner size={15} />
          Creating an account for you...
        </AnimatedDiv>
      )}
      {(successCreating || user) && (
        <AnimatedDiv duration={1000}>
          🎉 Success. Redirecting you to the vacancies page...
        </AnimatedDiv>
      )}
    </>
  );
};

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const hasClearedLs = isLoaded && !isSignedIn;
    if (hasClearedLs) signOut();
  }, [isSignedIn, isLoaded]);

  const isFirstLogin = !isSignedIn && isLoaded;

  return (
    <>
      <Head>
        <title>Logging into Vocatio...</title>
      </Head>
      <div className="flex-center h-screen flex-col gap-4">
        <header className="fixed inset-0">
          <ProgressIncrementer canFinish={isLoaded} shouldHide />
        </header>
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
