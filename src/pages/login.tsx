import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { api } from "~/utils";

const LoginPage: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  /**
   * Get method to create a user
   */
  const { mutate: createUser, isLoading: isCreatingUser } =
    api.users.create.useMutation({
      onSuccess: () => {
        console.info("Have a wonderful day!");
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
         * Having the token means that Clerk has authenticated the user.
         * Now we can create a user in our database.
         */
        createUser({
          ownName: user.fullName || "Your name", //todo
          ownImage: user.imageUrl,
          ownEmail: user.emailAddresses[0]!.emailAddress,
        });
      }
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Log into chirp</title>
      </Head>
      <section className="flex flex-col items-center gap-10 pt-40">
        <h1 className="text-[2rem]">
          {isLoaded
            ? isSignedIn
              ? "Success! You can safely return to using the extension."
              : "It's impossible to save your data without knowing you."
            : "Wait a sec..."}
        </h1>
        <div className="flex-center min-w-[10rem] rounded-sm bg-red p-5">
          {isSignedIn ? <SignOutButton /> : <SignInButton mode="modal" />}
        </div>
      </section>
    </>
  );
};

export default LoginPage;
