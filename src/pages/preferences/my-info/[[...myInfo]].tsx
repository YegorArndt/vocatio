import Head from "next/head";
import ScrollToTop from "react-scroll-to-top";

import { Layout } from "~/components/layout/Layout";
import { preferencesToolbar } from "~/modules/preferences/my-info/constants";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BoxFactory } from "~/modules/preferences/my-info/BoxFactory";
import { api } from "~/utils";
import { BoxName } from "~/modules/preferences/my-info/types";
import { useUpdateWithExtension } from "~/modules/preferences/my-info/useUpdateWithExtension";
import { useCongratUser } from "~/modules/preferences/my-info/useCongratUser";
import { ImportWithLinkedInPopover } from "~/modules/preferences/my-info/ImportWithLinkedInPopover";

const { log } = console;

type ServerProps = {
  updateKey: BoxName;
  expirationToken: string;
};

const boxes: BoxName[] = [
  "image",
  "main",
  "contact",
  "skills",
  "languages",
  "experience",
  "education",
];

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  return {
    props: context.query as ServerProps,
  };
};

export const MyInfoPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { updateKey, expirationToken } = props;

  const { data: user } = api.users.get.useQuery();

  const { isSuccess, isExpired, successUpdating } = useUpdateWithExtension({
    updateKey,
    expirationToken,
  });

  const isReady =
    updateKey && !isExpired ? !!(isSuccess && user && successUpdating) : !!user;

  useCongratUser();

  return (
    <>
      <Head>
        <title>My info - Vocatio</title>
        <meta name="description" content="Fine-tune your Vocatio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        <ProgressIncrementer
          className="left-[240px]"
          fixToTop
          shouldHide
          canFinish={isReady}
        />
        <section className="breakout">
          <h1>Review your info.</h1>
          <p>Vocatio will use it to generate your CVs.</p>
          {isReady && (
            <div className="flex flex-col gap-8">
              <header className="flex-y gap-3">
                <ImportWithLinkedInPopover text="Import" />
                <small className="rounded-md border bg-secondary px-3 clr-secondary">
                  ❗️ This rewrites your profile.
                </small>
              </header>
              {boxes.map((boxName) => (
                <BoxFactory
                  key={boxName}
                  boxName={boxName}
                  updateKey={updateKey}
                />
              ))}
            </div>
          )}
          {!isReady && (
            <div className="flex flex-col gap-8">
              {boxes.map((boxName) => (
                <div
                  key={boxName}
                  className="skeleton h-[350px] w-1/2 rounded-md"
                />
              ))}
            </div>
          )}
        </section>
        <ScrollToTop smooth color="black" className="flex-center" />
      </Layout>
    </>
  );
};

export default MyInfoPage;
