import { type GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Progress } from "~/components/external/Progress";
import { api } from "~/utils";
import { generateSSGHelper } from "~/server/api/utils/generateSSGHelper";
import { startCvGeneration } from "~/utils/startCvGeneration";
import { PartialUser } from "~/modules/extension/types";

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
  const [progress, setProgress] = useState(5);

  const { data: user } = api.users.get.useQuery();
  const { data: vacancy } = api.vacancies.getById.useQuery({ id: vacancyId });

  const router = useRouter();

  useEffect(() => {
    setInterval(() => setProgress((p) => p + 5), 1000);
    if (user && vacancy) {
      startCvGeneration(vacancy, user as PartialUser);
      void router.push("/vacancies");
      setProgress(100);
    }
  }, [user, vacancy]);

  return (
    <>
      <Head>
        <title>Generating CV...</title>
      </Head>
      <Progress value={progress} className="fixed inset-0 w-screen" />
    </>
  );
};

export default LoadingCvBuilder;
