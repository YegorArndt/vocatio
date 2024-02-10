import Head from "next/head";
import ScrollToTop from "react-scroll-to-top";

import { Layout } from "~/components/layout/Layout";
import { preferencesToolbar } from "~/modules/preferences/my-info/constants";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { usePersistentData } from "~/hooks/usePersistentData";
import { BoxFactory, BoxName } from "~/modules/preferences/my-info/BoxFactory";
import { useSendMessage } from "~/hooks/useSendMessage";
import { useEffect } from "react";
import { api, getMissingInfo } from "~/utils";
import { pick, startCase } from "lodash-es";
import { toast } from "sonner";
import { RouterUser } from "~/modules/create/design/extension/types";
import Image from "next/image";
import { Link } from "~/components/ui/buttons/Link";
import { linkedinJobsSearchUrl } from "~/constants";

const { log } = console;

type ServerProps =
  | {
      updateKey: keyof RouterUser;
      expirationToken: string;
    }
  | {};

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
    props: context.query,
  };
};

export const MyInfoPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  //@ts-ignore
  const { updateKey, expirationToken } = props;

  const { ls, updateLs } = usePersistentData();
  const { data: user } = api.users.get.useQuery();
  const { mutate: updateDatabase, isLoading: isUpdating } =
    api.users.update.useMutation();

  const {
    mutate: createShadowExperience,
    isLoading: creatingShadowExp,
    isSuccess: successCreatingShadowExp,
  } = api.users.createShadowExperience.useMutation({
    onSuccess: (userWithShadowExperience) => {
      //@ts-ignore
      updateLs({ user: userWithShadowExperience });
    },
  });

  const { sendMessage, hasSent, response, isExpired } = useSendMessage({
    expirationToken,
  });

  useEffect(() => {
    if (!updateKey) return;
    if (!hasSent) sendMessage({ type: "get-user" });

    try {
      if (!response.success || isUpdating) return;
      const { data } = response;
      if (!data?.user) throw new Error();

      //@ts-ignore
      let slice = { [updateKey]: data.user[updateKey] };

      if (updateKey === "main") {
        slice = pick(data.user, ["name", "jobTitle", "linkedinId", "image"]);
        //@ts-ignore
        slice.contact = [
          {
            name: "Email",
            value: ls.user?.email,
          },
          ...data.user.contact,
        ];
      }

      updateDatabase(slice);
      //@ts-ignore
      updateLs({ user: { ...ls.user, ...slice } });
      toast.success(`${startCase(updateKey)} updated.`);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  }, [response.success, hasSent, isExpired]);

  const isReady =
    updateKey && !isExpired ? !!(response.success && ls.user) : !!ls.user;

  useEffect(() => {
    if (!ls.user || ls.hasShownCongratsMessage) return;

    const missingInfo = getMissingInfo(ls.user);

    if (missingInfo.length === 0) {
      updateLs({ hasShownCongratsMessage: true });
      toast.dismiss();
      toast.success(
        <div className="flex-y gap-3">
          <Image
            src="/wow.jpg"
            height={50}
            width={50}
            alt=""
            className="rounded-full"
          />
          <div>
            Wow. So much info. <br />
            <small className="inline">
              Congrats!{" "}
              <Link
                frontIcon="👉"
                text="Open any vacancy"
                to={linkedinJobsSearchUrl}
                className="inline clr-blue"
                newTab
              />{" "}
              and use the extension to generate your first CV.
            </small>
          </div>
        </div>,
        { duration: 20000 }
      );
    }
  }, [ls.user]);

  useEffect(() => {
    if (!ls.user || !user) return;

    const hasShadowDescDatabaseRecord = user.experience?.find(
      (exp) => exp.shadowDescription
    );

    const shouldCreate =
      !hasShadowDescDatabaseRecord &&
      !creatingShadowExp &&
      !successCreatingShadowExp;

    if (shouldCreate) return createShadowExperience();

    const hasShadowDescLsRecord = ls.user.experience?.find(
      (exp) => exp.shadowDescription
    );

    if (!hasShadowDescLsRecord) {
      const hasShadowDescDatabaseRecord = user.experience?.find(
        (exp) => exp.shadowDescription
      );

      if (hasShadowDescDatabaseRecord) {
        updateLs({ user });
      }
    }
  }, [ls.user]);

  useEffect(() => {
    // Function to check user data
    const checkUser = () => {
      return { hasLsRecord: !!ls.user, user };
    };

    // Set a timeout to check user data after a delay
    const timeoutId = setTimeout(() => {
      const { hasLsRecord, user } = checkUser();
      if (!hasLsRecord) {
        updateLs({ user });
        toast.dismiss();
        toast.info("Loading your data...");
      }
    }, 5000);

    // Clear the timeout if the component unmounts or if relevant data changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [ls.user, user]); // Dependencies array

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
              {boxes.map((boxName) => (
                <BoxFactory
                  key={boxName}
                  boxName={boxName}
                  updateKey={updateKey}
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
