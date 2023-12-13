import Head from "next/head";
import { type PropsWithChildren } from "react";

import { Layout } from "~/components/layout/Layout";
import { BigEntryBox } from "~/modules/preferences/boxes/components/BigEntryBox";
import { ContactBox } from "~/modules/preferences/boxes/components/ContactBox";
import { EntryBox } from "~/modules/preferences/boxes/components/EntryBox";
import { ImageBox } from "~/modules/preferences/boxes/components/ImageBox";
import { MainBox } from "~/modules/preferences/boxes/components/MainBox";
import { preferencesToolbar } from "~/modules/preferences/constants";

type Item = PropsWithChildren<{
  label: string;
  name: string;
  id: string;
  className?: string;
}>;

export const Preferences = () => {
  return (
    <>
      <Head>
        <title>Fine-tuning - Vocatio</title>
        <meta name="description" content="Fine-tune your Vocatio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        <div className="content">
          <h1>Fine-tune your Vocatio.</h1>
          <p>
            This is the data that Vocatio will fallback to when generating your
            CVs. <br />
          </p>
          <div className="my-6 text-[1rem] font-thin tracking-wide">
            Instead of typing it all manually, navigate to respective LinkedIn
            section and open the extension. <br />
            Then just click{" "}
            <span className="border-bottom mx-1">✨ Fine-tune</span> to
            automatically get the data from there.
          </div>
          <div className="flex max-w-[1000px] flex-col gap-8">
            <ImageBox />
            <MainBox />
            <ContactBox />
            <EntryBox entryFor="languages" />
            <EntryBox entryFor="skills" />
            <BigEntryBox entryFor="education" />
            <BigEntryBox entryFor="employmentHistory" />
            <BigEntryBox entryFor="recommendations" />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Preferences;
