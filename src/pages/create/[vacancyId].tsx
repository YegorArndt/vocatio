import { GetServerSideProps } from "next";
import Head from "next/head";

import { api } from "~/utils";
import { Toolbar } from "~/modules/draft/components/Toolbar";
import { DraftContext } from "~/modules/draft/DraftContext";
import { DndProvider } from "~/modules/draft/components/DndProvider";
import cn from "classnames";
import { Layout } from "~/components/layout/Layout";
import { DesignViewer } from "~/modules/draft/components/DesignViewer";
import { PageBreak } from "~/modules/draft/components/PageBreak";
import { Lines } from "~/components/Spinner";
import { usePostMessage } from "~/hooks/usePostMessage";
import { useState, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "~/components/ui/buttons/Button";
import { getDraftByVacancyId } from "~/utils/ls";

const { log } = console;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { vacancyId } = context.params || {};

  if (typeof vacancyId !== "string")
    throw new Error("vacancyId is not a string");

  return {
    props: {
      vacancyId,
    },
  };
};

const CvBuilder = (props: { vacancyId: string }) => {
  const { vacancyId } = props;

  const draft = getDraftByVacancyId(vacancyId);

  const { a4Ref, a4Height, a4Width, pages, setPages } = useA4();

  usePostMessage({ interval: 2000 });

  const { data: vacancy } = api.vacancies.getById.useQuery({ id: vacancyId });

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
      {draft ? (
        <DraftContext draft={draft} a4Ref={a4Ref}>
          {(context) => (
            <Layout toolbar={<Toolbar />}>
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
                {!!a4Ref.current && (
                  <Button
                    data-html2canvas-ignore
                    frontIcon={<RiDeleteBin6Line />}
                    text={`Delete ${pages} page`}
                    onClick={() => setPages((prev) => prev - 1)}
                    className="primary sm col-span-2 mx-auto mt-6 w-[200px]"
                  />
                )}
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
            top: 64 + a4Height * (i + 1),
          }}
        />
      ))}
    </>
  );
};

export default CvBuilder;

const A4_HEIGHT = 1122;
const A4_WIDTH = 793;

const useA4 = () => {
  const [pages, setPages] = useState(1);
  const a4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a4 = a4Ref.current;
    if (!a4) return;

    const observer = new MutationObserver(() => {
      const pageCount = Math.ceil(a4.scrollHeight / A4_HEIGHT);
      setPages(pageCount);
    });

    observer.observe(a4, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [a4Ref.current]);

  return { a4Ref, a4Height: A4_HEIGHT, a4Width: A4_WIDTH, pages, setPages };
};
