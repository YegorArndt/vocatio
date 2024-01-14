import { type GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { startCvGeneration } from "~/utils/startCvGeneration";
import { PartialUser } from "~/modules/extension/types";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";

const { log } = console;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { vacancyId } = ctx.params || {};

  if (typeof vacancyId !== "string")
    throw new Error("vacancyId is not a string");

  const ssg = generateSSGHelper();
  await ssg.vacancies.getById.prefetch({ id: vacancyId });

  return { props: { vacancyId } };
};

const LoadingCvBuilder = (props: { vacancyId: string }) => {
  const { vacancyId } = props;

  const { data: user } = api.users.get.useQuery();
  const { data: vacancy, isError } = api.vacancies.getById.useQuery({
    id: vacancyId,
  });

  const router = useRouter();

  useEffect(() => {
    if (user && vacancy) {
      startCvGeneration(vacancy, user as PartialUser);
      void router.push("/vacancies");
    }
  }, [user, vacancy]);

  return (
    <>
      <Head>
        <title>Generating CV...</title>
      </Head>
      {!isError && <ProgressIncrementer canFinish={!!(user && vacancy)} />}
      {isError && (
        <main className="size-screen flex-center">
          😿 Something went wrong. Try to add the vacancy again.
        </main>
      )}
    </>
  );
};

export default LoadingCvBuilder;
