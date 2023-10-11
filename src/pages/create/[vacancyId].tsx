import { useUser } from "@clerk/nextjs";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useRef } from "react";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { DraftProvider } from "~/modules/draft/DraftProvider";
import { Toolbar } from "~/modules/toolbar/Toolbar";
import { Layout } from "~/components/layout/Layout";
import { LogoLoader } from "~/components/LogoLoader";
import { Area } from "~/modules/create/Area";
import { LEFT_HALF, leftHalfComponents } from "~/modules/draft/predefinedAreas";

const CVBuilder = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
          <DraftProvider
            initialDraft={{
              vacancyId: vacancy.id,
              image: user.ownImage || defaultUserData.imageUrl,
              name: user.ownName || defaultUserData.fullName || "John Doe",
              jobTitle: user.ownJobTitle || vacancy.jobTitle || "Engineer",
              objective: user.ownObjective || "Todo",
            }}
            rawData={{
              vacancy,
              user,
              defaultUserData,
            }}
          >
            <Toolbar a4Ref={a4Ref} />
            <div
              ref={a4Ref}
              className="dark-frame grid h-[1122px] !max-h-[1122px] w-[795px] max-w-[795px] grid-cols-[300px_1fr] bg-white"
            >
              <Area
                id={LEFT_HALF}
                className="flex h-full flex-col items-center bg-[#323B4C] py-7 pl-5 clr-white"
                components={leftHalfComponents}
                index={0}
              />
              {/* <Area
                id="right-half"
                className="bg-white px-[2rem] py-[5rem] clr-black"
                components={[]}
                index={1}
              /> */}
            </div>
          </DraftProvider>
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
