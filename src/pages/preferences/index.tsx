import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

import { Layout } from "~/components/layout/Layout";
import { Spinner } from "~/components";

const Preferences = () => {
  const router = useRouter();

  useEffect(() => {
    const lastViewed =
      localStorage.getItem("last-viewed-preference") || "my-data";
    router.push(`/preferences/${lastViewed}`);
  }, []);

  return (
    <>
      <Head>
        <title>Preferences</title>
        <meta
          name="description"
          content="Preferences page for the vacancy creation process"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="content flex-center h-[85vh]">
          <div className="flex-y gap-3">
            <Spinner size={15} /> Loading preferences...
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Preferences;
