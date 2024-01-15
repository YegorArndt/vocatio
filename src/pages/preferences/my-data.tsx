import Head from "next/head";
import { Spinner } from "~/components";
import ScrollToTop from "react-scroll-to-top";

import { Layout } from "~/components/layout/Layout";
import { preferencesToolbar } from "~/modules/preferences/constants";
import { api, cn } from "~/utils";
import { Steps } from "~/modules/preferences/Steps";
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
} from "~/components/external/Drawer";
import { FcIdea } from "react-icons/fc";
import { TbDatabaseImport } from "react-icons/tb";
import { Gpt } from "~/icons";
import { ContactBox } from "~/modules/preferences/boxes/components/ContactBox";
import { EntryBox } from "~/modules/preferences/boxes/components/EntryBox";
import { ImageBox } from "~/modules/preferences/boxes/components/ImageBox";
import { MainBox } from "~/modules/preferences/boxes/components/MainBox";
import { BigEntryBox } from "~/modules/preferences/boxes/components/BigEntryBox";

const { log } = console;

export const Preferences = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  const hasLkd = !!user?.contact?.linkedin;

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
            <div className="flex-y gap-3">
              <Spinner size={15} /> Loading your data...
            </div>
          </div>
        ) : (
          <section
            className={cn({
              breakout: hasLkd,
              content: !hasLkd,
            })}
          >
            <h1>
              {hasLkd ? "Your info." : "Import your profile from LinkedIn."}
            </h1>
            <p>
              {hasLkd
                ? "Review your info. Vocatio will fallback to it when generating your CVs."
                : "Don't type it manually. Value your time."}
            </p>
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
              </div>
            )}
          </section>
        )}
        {!userLoading && !hasLkd && <Steps />}

        {hasLkd && (
          <Drawer>
            <DrawerTrigger className="flex-y primary lg  fixed bottom-10 right-24 gap-3">
              <FcIdea />
              See useful tips
            </DrawerTrigger>
            <DrawerContent className="grid grid-flow-col-dense gap-5 bg-primary p-5">
              {[
                {
                  icon: <span>♾️</span>,
                  title: "Maximize relevance",
                  text: "Provide as much details as possible. Even not important ones. The AI only selects the key details leaving out the rest.",
                },
                {
                  icon: <Gpt />,
                  title: "Built-in prompt",
                  text: "If you have custom instructions for the AI you can directly inject them in your texts.",
                },
                {
                  icon: <TbDatabaseImport />,
                  title: "Import resume material",
                  text: "No need to retype your info. Just import it from an external source. Then you can review it and put on final touches if needed.",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="clr-card rounded-md bg-card p-5"
                >
                  <h3 className="flex-y gap-3">
                    <span>{tip.icon}</span>
                    {tip.title}
                  </h3>
                  <p>{tip.text}</p>
                </div>
              ))}
            </DrawerContent>
          </Drawer>
        )}
        <ScrollToTop smooth color="black" className="flex-center" />
      </Layout>
    </>
  );
};

export default Preferences;
