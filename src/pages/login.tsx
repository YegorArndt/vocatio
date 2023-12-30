import { SignInButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { UserResource } from "@clerk/types";

import { useEffect } from "react";
import { api } from "~/utils";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { usePostMessage } from "~/hooks/usePostMessage";
import { MessageContainer } from "~/components/MessageContainer";

const { log } = console;

const PrismaLayer = (props: { clerkUser: UserResource }) => {
  const { clerkUser } = props;

  const { data: userExists } = api.users.exists.useQuery({
    userId: clerkUser.id,
  });

  const { mutate: createUser, isSuccess } = api.users.create.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (userExists || isSuccess) void router.push("/vacancies");

    /**
     * Create user
     */
    if (!userExists && clerkUser) {
      createUser({
        name: clerkUser.fullName!,
        image: clerkUser.imageUrl,
        contact: {
          email: clerkUser.emailAddresses[0]!.emailAddress,
        },
      });
    }
  }, [userExists, isSuccess]);

  usePostMessage({ interval: 50 });

  return null;
};

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

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
              <Button text="Click here to sign in" className="primary sm" />
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
