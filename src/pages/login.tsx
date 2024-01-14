import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { VscSignIn } from "react-icons/vsc";
import type { UserResource } from "@clerk/types";

import { useEffect } from "react";
import { api } from "~/utils";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
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
    isSuccess,
    isLoading: creatingUser,
  } = api.users.create.useMutation();

  const router = useRouter();

  useEffect(() => {
    if ((user && !userLoading) || isSuccess) void router.push("/vacancies");

    const shouldCreate = isError || (!userLoading && !user && clerkUser);
    /**
     * Create user
     */
    if (shouldCreate) {
      createUser({
        name: clerkUser.fullName!,
        image: clerkUser.imageUrl,
        contact: {
          email: clerkUser.emailAddresses[0]!.emailAddress,
        },
      });
    }
  }, [user, isSuccess, isError]);

  return (
    isError && (
      <AnimatedDiv duration={3} className="flex-y gap-2">
        <Spinner size={15} />
        Creating an account for you...
      </AnimatedDiv>
    )
  );
};

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) signOut();
  }, [isSignedIn, isLoaded]);

  return (
    <>
      <Head>
        <title>Log into Vocatio</title>
      </Head>
      <div className="flex-center h-screen flex-col gap-4">
        {!isSignedIn && isLoaded ? (
          <AnimatedDiv className="flex-center flex-col gap-4">
            Welcome to Vocatio
            <SignInButton>
              <Button
                frontIcon={<VscSignIn />}
                text="Click here to sign in"
                className="primary sm"
              />
            </SignInButton>
          </AnimatedDiv>
        ) : (
          <MessageContainer>
            <AnimatedDiv duration={2}>Welcome to Vocatio</AnimatedDiv>
            <AnimatedDiv duration={3} className="flex-y gap-2">
              <Spinner size={15} />
              Quick Sign In...
            </AnimatedDiv>
          </MessageContainer>
        )}
        {isSignedIn && <PrismaLayer clerkUser={clerkUser} />}
      </div>
    </>
  );
};

export default LoginPage;
