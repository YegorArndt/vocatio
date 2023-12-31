import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import { Layout } from "~/components/layout/Layout";
import { Placeholder } from "~/components/Placeholder";
import { Spinner } from "~/components";

/**
 * TODO: if data was cleared navigating to /create will cause errors bcs the data in LS is still there
 */

export const Create = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lastEdited = localStorage.getItem("last-edited-vacancy");
    if (lastEdited) void router.push(`/create/${lastEdited}`);
    else setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Create a new CV!</title>
        <meta
          name="description"
          content="Create a new CV tailored to the job you want to apply for."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isLoading ? (
          <div className="content flex-center h-[85vh]">
            <Spinner />
          </div>
        ) : (
          <Placeholder to="/vacancies" className="content" />
        )}
      </Layout>
    </>
  );
};

export default Create;
