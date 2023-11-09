import { useUser } from "@clerk/nextjs";
import { type GetStaticProps } from "next";
import { useEffect, useRef } from "react";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { Toolbar } from "~/modules/toolbar/Toolbar";
import { Layout } from "~/components/layout/Layout";
import { LogoLoader } from "~/components/LogoLoader";
import { DraftContext } from "~/modules/draft/DraftContext";
import { DndProvider } from "~/modules/create/DndProvider";

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
    <Layout>
      <div className="flex-center relative pt-[4rem]">
        {(userLoading || vacancyLoading) && <LogoLoader />}
        {vacancy && user && defaultUserData && (
          <DraftContext
            defaultUserData={defaultUserData}
            vacancy={vacancy}
            user={user}
          >
            <Toolbar a4Ref={a4Ref} />
            <div ref={a4Ref} className="a4">
              <DndProvider />
            </div>
          </DraftContext>
        )}
      </div>
    </Layout>
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
