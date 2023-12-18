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
import { toast } from "react-toastify";
import { FcCheckmark } from "react-icons/fc";
import { lowerCase, startCase } from "lodash-es";
import { Button } from "~/components/ui/buttons/Button";
import { ModalFactory } from "~/modules/modal/ModalFactory";
import { Diff } from "~/modules/create/Diff";
import { Lines } from "~/components/Spinner";

const { log } = console;

const AdjustmentBlock = (props: { title: string; changes: string[] }) => {
  const { title, changes } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold">{title}</div>
      {changes.map((change) => (
        <div key={change} className="flex-y gap-2">
          <FcCheckmark />
          {startCase(lowerCase(change))}
        </div>
      ))}
    </div>
  );
};

const a4Height = 1122;
const a4Width = 793;

const CVBuilder = (props: { vacancyId: string }) => {
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

  const isReady = vacancy && user && defaultUserData && draft;

  useEffect(() => {
    /**
     * Save the last edited vacancy.
     */
    localStorage.setItem("last-edited-vacancy", vacancyId);
  }, []);

  useEffect(() => {
    if (!user || !draft || !vacancy) return;

    /**
     * Notify the user that changes have been made.
     */
    const changes = {
      slightly: ["employmentHistory", "skills"],
      completely: ["jobTitle"],
    };

    const notifyOnMount = (changes: {
      slightly: string[];
      completely: string[];
    }) => {
      toast(
        <div className="flex flex-col gap-2">
          <h3>Changes made 🎉</h3>
          <AdjustmentBlock
            title="Slightly adjusted:"
            changes={changes.slightly}
          />
          <AdjustmentBlock
            title="Completely adjusted:"
            changes={changes.completely}
          />
          <Button
            text="Click to view changes"
            className="sm mt-3 rounded-md bg-blue clr-white"
            onClick={() => {
              toast.dismiss("diff");
              ModalFactory.open("diff", {
                className: "!w-[1500px] overflow-hidden",
                children: (
                  <Diff
                    vacancy={vacancy}
                    professionalSummary={{
                      old: user.professionalSummary,
                      new: draft?.professionalSummary,
                    }}
                    employmentHistory={{
                      old: user.employmentHistory,
                      new: user?.employmentHistory,
                    }}
                    jobTitle={{
                      old: user.jobTitle,
                      new: draft?.jobTitle,
                    }}
                  />
                ),
              });
            }}
          />
        </div>,
        {
          autoClose: false,
          toastId: "diff",
          closeOnClick: false,
        }
      );
    };

    notifyOnMount(changes);

    return () => {
      toast.dismiss("diff");
    };
  }, [userLoading, draftLoading, vacancyLoading]);

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

  log(draft);

  return (
    <>
      <Head>
        <title>
          {vacancy?.companyName ? `CV for ${vacancy.companyName}` : "Loading"} -
          Vocatio
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
          user={{ ...user, ...draft }}
        >
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

export default CVBuilder;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const vacancyId = context.params?.vacancyId;

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
