import { useUser } from "@clerk/nextjs";
import { type GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { Toolbar } from "~/modules/toolbar/Toolbar";
import { DraftContext } from "~/modules/draft/DraftContext";
import { DndProvider } from "~/modules/create/DndProvider";
import cn from "classnames";
import { Layout } from "~/components/layout/Layout";
import { DesignViewer } from "~/components/DesignViewer";
import { PageBreak } from "~/modules/create/PageBreak";

type CVBuilderProps = {
  vacancyId: string;
};

const a4Height = 1122;
const a4Width = 793;

const CVBuilder = (props: CVBuilderProps) => {
  const { vacancyId } = props;
  const [pages, setPages] = useState(1);

  const a4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => localStorage.setItem("last-edited-vacancy", vacancyId), []);

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

  // Get data
  const { user: defaultUserData } = useUser();

  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({
      id: vacancyId,
    });

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
      {vacancy && user && defaultUserData && (
        <DraftContext
          defaultUserData={defaultUserData}
          vacancy={vacancy}
          user={user}
        >
          {(context) => (
            <Layout asideChildren={<Toolbar a4Ref={a4Ref} />}>
              <div className="top-offset flex gap-[5rem] pl-[6rem]">
                <div
                  ref={a4Ref}
                  className={cn("a4", context.design.a4)}
                  style={{
                    height: a4Height * pages,
                    width: a4Width,
                  }}
                >
                  <DndProvider />
                </div>
                <DesignViewer />
              </div>
            </Layout>
          )}
        </DraftContext>
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
