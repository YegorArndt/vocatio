import Head from "next/head";
import ScrollToTop from "react-scroll-to-top";

import { Layout } from "~/components/layout/Layout";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BoxFactory } from "~/modules/settings/me/BoxFactory";
import { api } from "~/utils";
import { BoxName } from "~/modules/settings/me/types";
import { useUpdateWithExtension } from "~/modules/settings/me/useUpdateWithExtension";
import { useCongratUser } from "~/modules/settings/me/useCongratUser";
import { ImportWithLinkedInPopover } from "~/modules/settings/me/ImportWithLinkedInPopover";
import { NavigationLink } from "~/components";
import { MeImage } from "~/components/MeImage";
import { BuildDefaultCvLink } from "~/modules/settings/me/BuildDefaultCvLink";

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

export const MePage = (
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
        <title>Me - Vocatio</title>
        <meta
          name="description"
          content="Information about you that will be used for CV generation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        toolbar={
          <NavigationLink
            frontIcon={<MeImage />}
            text="Me"
            to="/settings/me"
            baseCn="common hover flex-y gap-1"
            activeCn="main-hover"
            activeIfIncludes={["updateKey"]}
          />
        }
      >
        <ProgressIncrementer
          className="left-[240px]"
          fixToTop
          shouldHide
          canFinish={isReady}
        />
        <section className="breakout">
          <h1>Review your info.</h1>
          <p className="clr-ghost">Vocatio will use it to generate your CVs.</p>
          {isReady && (
            <div className="flex flex-col gap-8">
              <header className="flex-y gap-3">
                <BuildDefaultCvLink />
                <ImportWithLinkedInPopover />
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

export default MePage;
