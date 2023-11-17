import { useUser } from "@clerk/nextjs";
import { type GetStaticProps } from "next";
import { useEffect, useRef } from "react";
import Head from "next/head";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { Toolbar } from "~/modules/toolbar/Toolbar";
import { DraftContext } from "~/modules/draft/DraftContext";
import { DndProvider } from "~/modules/create/DndProvider";
import { CreatePageSkeleton } from "~/components/loaders/CreatePageSkeleton";
import cn from "classnames";
import { Layout } from "~/components/layout/Layout";
import { DesignViewer } from "~/components/DesignViewer";

type CVBuilderProps = {
  vacancyId: string;
};

const CVBuilder = (props: CVBuilderProps) => {
  const { vacancyId } = props;

  const a4Ref = useRef(null);

  useEffect(() => {
    localStorage.setItem("last-edited-vacancy", vacancyId);
  }, []);

  /**
   * Get default user data from Clerk
   */
  const { user: defaultUserData } = useUser();

  /**
   * Get vacancy data from database
   */
  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({
      id: vacancyId,
    });

  /**
   * Get user data from database
   */
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  return (
    <>
      <Head>
        <title>Create a CV - Vocatio</title>
        <meta
          name="description"
          content="Free CV AI builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {(userLoading || vacancyLoading) && (
          <CreatePageSkeleton className="pt-[4rem]" />
        )}
        {vacancy && user && defaultUserData && (
          <DraftContext
            defaultUserData={defaultUserData}
            vacancy={vacancy}
            user={user}
          >
            {(a4Classes, changingDesign) => (
              <div
                className={cn("relative overflow-hidden pt-[4rem]", {
                  "mx-auto flex max-w-[90rem] gap-8": changingDesign,
                  "flex-center": !changingDesign,
                })}
              >
                {!changingDesign && <Toolbar a4Ref={a4Ref} />}
                <div ref={a4Ref} className={cn("a4", a4Classes)}>
                  <DndProvider />
                </div>
                {changingDesign && <DesignViewer />}
              </div>
            )}
          </DraftContext>
        )}
      </Layout>
    </>
  );
};

export default CVBuilder;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const vacancyId = context.params?.vacancyId;

  if (typeof vacancyId !== "string")
    throw new Error("VacancyId is not a string");

  await ssg.vacancies.getById.prefetch({ id: vacancyId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      vacancyId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
