import { useUser } from "@clerk/nextjs";
import { type GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { Toolbar } from "~/modules/create/toolbar/Toolbar";
import { DraftContext } from "~/modules/draft/DraftContext";
import { DndProvider } from "~/modules/create/DndProvider";
import cn from "classnames";
import { Layout } from "~/components/layout/Layout";
import { DesignViewer } from "~/modules/create/DesignViewer";
import { PageBreak } from "~/modules/create/PageBreak";
import { ModalFactory } from "~/modules/modal/ModalFactory";
import { Diff } from "~/modules/create/Diff";
import { Lines } from "~/components/Spinner";
import { DraftContextInput } from "~/modules/draft/types";
import { usePostMessage } from "~/hooks/usePostMessage";

const { log } = console;

const a4Height = 1122;
const a4Width = 793;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const { vacancyId } = context.params || {};

  if (typeof vacancyId !== "string")
    throw new Error("VacancyId is not a string");

  await ssg.vacancies.getById.prefetch({ id: vacancyId });
  await ssg.drafts.getByVacancyId.prefetch({ vacancyId });

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

const CvBuilder = (props: { vacancyId: string }) => {
  const { vacancyId } = props;
  const [pages, setPages] = useState(1);

  const a4Ref = useRef<HTMLDivElement>(null);

  /**
   * Fetch all data.
   */
  const { user: defaultUserData } = useUser();
  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({
      id: vacancyId,
    });
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const { data: draft, isLoading: draftLoading } =
    api.drafts.getByVacancyId.useQuery({ vacancyId });

  const openModal = () => {
    if (!user || !draft || !vacancy) return;
    ModalFactory.open("diff", {
      className: "!w-[1500px]",
      children: (
        <Diff
          vacancy={vacancy}
          professionalSummary={{
            old: user.professionalSummary!,
            new: draft.professionalSummary!,
          }}
          employmentHistory={{
            old: user.employmentHistory,
            new: draft.employmentHistory,
          }}
          jobTitle={{
            old: user.jobTitle!,
            new: draft.jobTitle!,
          }}
        />
      ),
    });
  };

  useEffect(() => {
    const a4 = a4Ref.current;
    if (!a4) return;

    const observer = new MutationObserver(() => {
      const pageCount = Math.ceil(a4.scrollHeight / a4Height);
      setPages(pageCount);
    });

    observer.observe(a4, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [a4Ref.current]);

  usePostMessage({ interval: Infinity });

  const isReady = vacancy && user && defaultUserData && draft;

  return (
    <>
      <Head>
        <title>
          {vacancy?.companyName ? `CV for ${vacancy.companyName}` : "Loading"}
        </title>
        <meta
          name="description"
          content="Free AI CV builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isReady ? (
        <DraftContext
          a4Ref={a4Ref}
          defaultUserData={defaultUserData}
          vacancy={vacancy}
          user={{ ...user, ...draft } as unknown as DraftContextInput["user"]}
        >
          {(context) => (
            <Layout toolbar={<Toolbar openModal={openModal} />}>
              <div className="two-col-grid">
                <div
                  ref={a4Ref}
                  className={cn("a4 main-center", context.design.a4)}
                  style={{
                    height: a4Height * pages,
                    width: a4Width,
                    fontFamily: context.design.font,
                  }}
                >
                  <DndProvider sections={context.design.sections} />
                </div>
                <DesignViewer />
              </div>
            </Layout>
          )}
        </DraftContext>
      ) : (
        <Layout toolbar={<Lines />}>
          <div className="two-col-grid">
            <div
              className="a4 main-center skeleton rounded-md"
              style={{
                height: a4Height * pages,
                width: a4Width,
              }}
            />
            <div className="right-aside skeleton rounded-md" />
          </div>
        </Layout>
      )}
      {Array.from({ length: pages - 1 }).map((_, i) => (
        <PageBreak
          key={i}
          style={{
            top: 64 + 1122 * (i + 1),
          }}
        />
      ))}
    </>
  );
};

export default CvBuilder;
