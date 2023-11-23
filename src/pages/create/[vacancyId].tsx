import { useUser } from "@clerk/nextjs";
import { type GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";
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
import { Button } from "~/components/ui/buttons/Button";
import { GarbageBin } from "~/modules/create/GarbageBin";

type CVBuilderProps = {
  vacancyId: string;
};

const a4Height = 1122;
const a4Width = 793;

const ordinalSuffixOf = (n: number) => {
  const j = n % 10,
    k = n % 100;
  if (j === 1 && k !== 11) {
    return n + "st";
  }
  if (j === 2 && k !== 12) {
    return n + "nd";
  }
  if (j === 3 && k !== 13) {
    return n + "rd";
  }
  return n + "th";
};

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
      <Layout>
        {(userLoading || vacancyLoading) && (
          <CreatePageSkeleton className="top-offset" />
        )}
        {vacancy && user && defaultUserData && (
          <DraftContext
            defaultUserData={defaultUserData}
            vacancy={vacancy}
            user={user}
          >
            {(a4Classes, changingDesign) => (
              <div
                className={cn("top-offset relative", {
                  "mx-auto flex max-w-[90rem] gap-8": changingDesign,
                  "flex-center": !changingDesign,
                })}
              >
                {!changingDesign && <Toolbar a4Ref={a4Ref} />}
                <div
                  ref={a4Ref}
                  className={cn("a4", a4Classes)}
                  style={{
                    height: a4Height * pages,
                    width: a4Width,
                  }}
                >
                  <DndProvider />
                </div>
                {Array.from({ length: pages - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="page-break"
                    style={{
                      top: 64 + 1122 * (i + 1),
                    }}
                  >
                    {i === pages - 2 && ( // Render button only for the last page break
                      <div className="absolute -left-[13rem] -top-[1rem] flex flex-col gap-3">
                        <Button
                          text="Delete last page"
                          className="sm common primary"
                          onClick={() => setPages(pages - 1)}
                        />
                        <small>
                          If content is cut off it will reappear <br />
                          once CV is interacted with.
                        </small>
                      </div>
                    )}
                  </div>
                ))}
                <GarbageBin vacancyId={vacancy.id} />
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
