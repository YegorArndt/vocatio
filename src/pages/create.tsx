import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import { Layout } from "~/components/layout/Layout";
import { Placeholder } from "~/components/Placeholder";
import { api } from "~/utils";
import { LogoLoader } from "~/components/LogoLoader";

/**
 * TODO: if data was cleared navigating to /create will cause errors bcs the data in LS is still there
 */

export const Create = () => {
  const [placeholderShown, setPlaceholderShown] = useState(false);
  const [lastEditedVacancyId, setLastEditedVacancyId] = useState("");
  const { data, isLoading } = api.vacancies.getById.useQuery({
    id: lastEditedVacancyId,
  });
  const router = useRouter();

  useEffect(() => {
    const lastEditedVacancyId = localStorage.getItem("last-edited-vacancy");
    if (lastEditedVacancyId) setLastEditedVacancyId(lastEditedVacancyId);

    if (data) router.push(`/create/${lastEditedVacancyId}`);
    else setPlaceholderShown(true);
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Create a new CV!</title>
        <meta
          name="description"
          content="Keep your job applications organized"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>{placeholderShown ? <Placeholder /> : <LogoLoader />}</Layout>
    </>
  );
};

export default Create;
