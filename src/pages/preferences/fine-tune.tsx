import Head from "next/head";
import { PropsWithChildren } from "react";

import { Layout } from "~/components/layout/Layout";
import { preferencesToolbar } from "~/modules/preferences/constants";
import { MainBox } from "~/modules/preferences/boxes/components/MainBox";
import { ContactBox } from "~/modules/preferences/boxes/components/ContactBox";
import { ImageBox } from "~/modules/preferences/boxes/components/ImageBox";
import { BigEntryBox } from "~/modules/preferences/boxes/components/BigEntryBox";
import { EntryBox } from "~/modules/preferences/boxes/components/EntryBox";

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
        <section className="two-col-grid">
          <div className="main-center">
            <h1>Fine-tune your Vocatio.</h1>
            <p>
              This is the data that Vocatio will fallback to when generating
              your CVs. <br />
            </p>
            <div className="guide my-6">
              Instead of typing it all manually, navigate to respective LinkedIn
              section and open the extension. <br />
              Then just click{" "}
              <span className="border-bottom mx-1">✨ Fine-tune</span> to
              automatically get the data from there.
            </div>
            <div className="flex flex-col gap-8">
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
          <aside className="right-aside">
            <div className="sticky top-16 flex flex-col gap-3">
              <h4>Overview</h4>
              {/* <ul className="flex flex-col gap-2">
                {typedKeys(userData).map((title) => (
                  <li key={title}>
                    <a href={`#${title}`} className="hover:underline">
                      {startCase(title)}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          </aside>
        </section>
      </Layout>
    </>
  );
};

export default Preferences;
