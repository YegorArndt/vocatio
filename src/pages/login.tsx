import type { NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useEffect } from "react";

const LoginPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (user) {
      const sessionToken = Cookies.get("__session");
      if (sessionToken) {
        /**
         * Send token directly to content script via postMessage
         */
        window.postMessage(
          { type: "FROM_PAGE", token: sessionToken, userId: user.id },
          "*"
        );
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
          It&apos;s impossible to save your data without knowing you.
        </h1>
        <div className="flex-center min-w-[10rem] rounded-sm bg-red p-5">
          {isSignedIn ? (
            <SignOutButton />
          ) : (
            <SignInButton redirectUrl="/login" mode="modal" />
          )}
        </div>
      </section>
    </>
  );
};

export default LoginPage;
