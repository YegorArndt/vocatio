import Head from "next/head";

import { Layout } from "~/components/layout/Layout";

const { log } = console;

export const Create = () => {
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
      <Layout></Layout>
    </>
  );
};

export default Create;
