import type { NextPage } from "next";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { api } from "~/utils";
import { Spinner } from "~/components";
import { useRouter } from "next/router";
import cn from "classnames";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const LoginPage: NextPage = () => {
  const { user } = useUser();
  const { data: prismaUser, isLoading: prismaUserLoading } =
    api.users.get.useQuery();
  const router = useRouter();

  /**
   * Get method to create a user
   */
  const { mutate: createUser, isLoading: isCreatingUser } =
    api.users.create.useMutation({
      onSuccess: () => {
        console.info("✨ Have a wonderful day!");
        void router.push("/vacancies");
      },
      onError: (error) => {
        const errorMessage = error.data?.zodError?.fieldErrors.content;
        if (errorMessage?.[0]) return;
      },
    });

  /**
   * Redirect to Clerk's sign in page if the user doesn't exist in our database.
   */
  useEffect(() => {
    if (!prismaUser && !prismaUserLoading) {
      void router.push(
        "https://splendid-amoeba-59.accounts.dev/sign-in?redirect_url=https%3A%2F%2Fchirp-mu-rust-60.vercel.app%2Flogin"
      );
    } else {
      // Push to vacancies in one second. So that the user can see the welcome message.
      setTimeout(() => {
        void router.push("/vacancies");
      }, 2000);
    }
  }, [prismaUser]);

  /**
   * Create a user in our database when Clerk has authenticated the user.
   */
  useEffect(() => {
    if (user) {
      const sessionToken = Cookies.get("__session");

      if (sessionToken) {
        /**
         * Send token directly to content script via postMessage (extension).
         */
        window.postMessage(
          { type: "FROM_PAGE", token: sessionToken, userId: user.id },
          "*"
        );

        /**
         * Post message every miniute to keep the session alive.
         */
        setInterval(() => {
          window.postMessage(
            { type: "FROM_PAGE", token: sessionToken, userId: user.id },
            "*"
          );
        }, 60000);

        if (prismaUser || prismaUserLoading) return;

        /**
         * Having the token means that Clerk has authenticated the user.
         * Now we can create a user in our database.
         */
        createUser({
          name: user.fullName!,
          image: user.imageUrl,
          contact: {
            email: user.emailAddresses[0]!.emailAddress,
          },
        });
      }
    }
  }, [user]);

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
              "Checking if account exists...": prismaUserLoading,
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
