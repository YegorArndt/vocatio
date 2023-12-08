import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { api } from "~/utils";
import { SpinnerWithLayout } from "~/components";
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const { user } = useUser();
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

        if (errorMessage?.[0]) {
          return;
        }

        // toast.error("Something went wrong");
      },
    });

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
        });

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
      <SpinnerWithLayout text="Creating your account..." />
    </>
  );
};

export default LoginPage;
