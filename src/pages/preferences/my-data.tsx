import Head from "next/head";
import { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Chip, Spinner } from "~/components";
import { Glassdoor, Indeed, Hh } from "~/components/icons";
import ScrollToTop from "react-scroll-to-top";

import { Layout } from "~/components/layout/Layout";
import { ContactBox } from "~/modules/preferences/boxes/components/ContactBox";
import { EntryBox } from "~/modules/preferences/boxes/components/EntryBox";
import { ImageBox } from "~/modules/preferences/boxes/components/ImageBox";
import { MainBox } from "~/modules/preferences/boxes/components/MainBox";
import { preferencesToolbar } from "~/modules/preferences/constants";
import { api } from "~/utils";
import { Steps } from "~/modules/preferences/Steps";
import { BigEntryBox } from "~/modules/preferences/boxes/components/BigEntryBox";
import { usePostMessage } from "~/hooks/usePostMessage";

const { log } = console;

const icons = [
  {
    icon: <Glassdoor />,
    tooltip: "Glassdoor",
  },
  {
    icon: <Indeed />,
    tooltip: "Indeed",
  },
  {
    icon: <Hh />,
    tooltip: "HeadHunter",
  },
  {
    icon: <BsUpload />,
    tooltip: "CV upload",
  },
];

export const Preferences = () => {
  const [prefersCefr, setPrefersCefr] = useState(false);
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  const hasLkd = !!user?.contact?.linkedin;

  usePostMessage();

  return (
    <>
      <Head>
        <title>My data - Vocatio</title>
        <meta name="description" content="Fine-tune your Vocatio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        {userLoading ? (
          <div className="content flex-center h-[85vh]">
            <Spinner />
          </div>
        ) : (
          <section className="two-col-grid mb-8">
            <div className="main-center">
              <h1>
                {hasLkd
                  ? "Review your data. Did we get it right?"
                  : "Import your data from LinkedIn."}
              </h1>
              <p>
                {hasLkd
                  ? "Vocatio will fallback to it when generating your CVs."
                  : "Don't type it manually. Value your time."}
              </p>
              {hasLkd && (
                <div className="flex-y mb-6 gap-2">
                  <Chip text="Soon supported" className="bg-sky px-3" />
                  {icons.map(({ icon, tooltip }) => (
                    <span key={tooltip} data-tooltip-id={tooltip}>
                      {icon}
                      <Tooltip
                        id={tooltip}
                        content={tooltip}
                        variant="light"
                        place="bottom"
                      />
                    </span>
                  ))}
                </div>
              )}
              {hasLkd && (
                <div className="flex flex-col gap-8">
                  <ImageBox />
                  <MainBox />
                  <ContactBox />
                  <EntryBox
                    entryFor="languages"
                    labelOptions={[]}
                    valueOptions={[]}
                  />
                  <EntryBox
                    entryFor="skills"
                    labelOptions={[]}
                    valueOptions={[]}
                  />
                  <BigEntryBox entryFor="employmentHistory" />
                  <BigEntryBox entryFor="education" />
                  {/* <BigEntryBox entryFor="recommendations" /> */}
                </div>
              )}
            </div>
            <div className="right-aside flex h-[500px] flex-col gap-3 rounded-md border bg-card p-5">
              <h3 className="mb-4">Tips</h3>
              {[
                "Put as much relevant data as possible. The AI will choose what to include from your employment history & professional summary. This is an advantage over a static CV where you can't fit everything.",
                "If you see that some of your data is missing, despite importing it from LinkedIn, it's probably because LinkedIn didn't load it all when you clicked 'Import' in the extension. Navigate to the respective section again (like Skills - they tend to be quite long) and scroll all the way down so that all skills are loaded.",
                "Just click copy item to create and edit a new entry.",
              ].map((tip, index) => (
                <span key={index}>
                  {index + 1}. {tip}
                </span>
              ))}
            </div>
          </section>
        )}
        {!userLoading && !hasLkd && <Steps />}
        <ScrollToTop smooth color="black" className="flex-center" />
      </Layout>
    </>
  );
};

export default Preferences;
