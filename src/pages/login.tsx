import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { UserResource } from "@clerk/types";

import {
  PropsWithChildren,
  useState,
  useEffect,
  Children,
  ReactElement,
  cloneElement,
} from "react";
import { clerkAuth } from "~/constants";
import { api } from "~/utils";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";

const { log } = console;

const MessageContainer = (
  props: PropsWithChildren<{ className?: string; duration?: number }>
) => {
  const { children, className } = props;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const childArray = Children.toArray(children);

    const displayNextMessage = (index: number) => {
      if (index >= childArray.length) return;

      const currentChild = childArray[index] as ReactElement;
      const duration = currentChild.props.duration * 1000;

      const timer = setTimeout(() => {
        setCurrentMessageIndex(index + 1);
        displayNextMessage(index + 1);
      }, duration);

      return timer;
    };

    const timer = displayNextMessage(0);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div className={className}>
      {Children.map(
        children,
        (child, index) =>
          index === currentMessageIndex &&
          child !== null &&
          cloneElement(child as ReactElement, {
            key: index,
          })
      )}
    </div>
  );
};

const PrismaLayer = (props: { clerkUser: UserResource }) => {
  const { clerkUser } = props;

  const { data: userExists } = api.users.exists.useQuery({
    userId: clerkUser.id,
  });

  const { mutate: createUser } = api.users.create.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (userExists) void router.push("/vacancies");

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
  }, [userExists]);

  return null;
};

const LoginPage: NextPage = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn === false) void router.push(clerkAuth);
  }, [isSignedIn]);

  return (
    <>
      <Head>
        <title>Log into Vocatio</title>
      </Head>
      <div className="flex-center h-screen">
        <MessageContainer>
          <AnimatedDiv duration={2}>Welcome to Vocatio</AnimatedDiv>
          <AnimatedDiv duration={3} className="flex-y gap-2">
            <Spinner size={15} />
            Quick Sign In...
          </AnimatedDiv>
        </MessageContainer>
        {clerkUser && <PrismaLayer clerkUser={clerkUser} />}
      </div>
    </>
  );
};

export default LoginPage;
