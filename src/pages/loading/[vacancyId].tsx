import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Spinner } from "~/components";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { api } from "~/utils";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const vacancyId = context.params?.vacancyId;

  if (typeof vacancyId !== "string")
    throw new Error("VacancyId is not a string");

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

const LoadingCvBuilder = (props: { vacancyId: string }) => {
  const { vacancyId } = props;
  const router = useRouter();
  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({
      id: vacancyId,
    });
  const {
    mutate: createDraft,
    isSuccess: successCreatingDraft,
    isLoading: creatingDraft,
  } = api.drafts.create.useMutation({
    onSuccess: () => void router.push(`/create/${vacancyId}`),
  });

  useEffect(() => {
    if (!vacancy) return;

    createDraft({
      vacancyId: vacancy.id,
    });
  }, [vacancy]);

  return (
    <>
      <Head>
        <title>Generating CV...</title>
      </Head>
      <main className="flex-center h-screen w-screen">
        <div className="flex-y gap-2">
          {(vacancyLoading || creatingDraft || successCreatingDraft) && (
            <Spinner size={15} />
          )}
          {vacancyLoading && <AnimatedDiv>Analyzing vacancy...</AnimatedDiv>}
          {creatingDraft && (
            <AnimatedDiv>Hold on. Generating CV...</AnimatedDiv>
          )}
          {successCreatingDraft && (
            <AnimatedDiv>Redirecting to CV builder...</AnimatedDiv>
          )}
        </div>
      </main>
    </>
  );
};

export default LoadingCvBuilder;
