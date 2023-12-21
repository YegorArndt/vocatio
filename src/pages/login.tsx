import type { NextPage } from "next";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils";
import { Spinner } from "~/components";
import { useRouter } from "next/router";
import cn from "classnames";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const {
    data: prismaUser,
    isLoading: prismaUserLoading,
    isError: prismaUserError,
  } = api.users.get.useQuery();
  const router = useRouter();
  const { mutate: createUser, isLoading: isCreatingUser } =
    api.users.create.useMutation();

  /**
   * Create a user in our database when Clerk has authenticated the user.
   */
  useEffect(() => {
    if (!isSignedIn || prismaUserLoading) return;
    /**
     * Create user in 1.5 seconds after error.
     */
    setTimeout(() => {
      createUser({
        name: clerkUser.fullName!,
        image: clerkUser.imageUrl,
        contact: {
          email: clerkUser.emailAddresses[0]!.emailAddress,
        },
      });
    }, 1500);
  }, [isSignedIn]);

  useEffect(() => {
    if (!prismaUser) return;
    /**
     * Push to vacancies in one second. So that the user can see the welcome message.
     */
    setTimeout(() => {
      void router.push("/vacancies");
    }, 1700);
  }, [prismaUser]);

  return (
    <>
      <Head>
        <title>Log into Vocatio</title>
      </Head>
      <div className="flex-center h-screen w-screen flex-col gap-5">
        {!prismaUser && (
          <Fragment>
            <Spinner />
            {cn({
              "Checking if account exists...":
                prismaUserLoading && !isCreatingUser,
              "Let's create an account for you": prismaUserError,
              "Creating your account...": isCreatingUser,
            })}
          </Fragment>
        )}
        {prismaUser && (
          <AnimatedDiv>Welcome and have a wonderful day ✨ </AnimatedDiv>
        )}
      </div>
    </>
  );
};

export default LoginPage;
