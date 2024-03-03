import Head from "next/head";

import { Layout } from "~/components/layout/Layout";
import { ImportWithLinkedInPopover } from "~/modules/settings/me/ImportWithLinkedInPopover";
import { UploadCvPopover } from "~/modules/settings/me/UploadCvPopover";
import { Button } from "~/components/ui/buttons/Button";
import { BlurImage } from "~/components";

const SettingsPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta
          name="description"
          content="settings page for the vacancy creation process"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="breakout">
          <section>
            <h1>Ways to import your profile.</h1>
            <p className="clr-ghost">
              Vocatio will use it to generate your CVs.
            </p>
            <div className="flex w-min flex-col gap-4">
              <ImportWithLinkedInPopover />
              <UploadCvPopover />
              <Button
                frontIcon={
                  <BlurImage src="/loading-cat.gif" height={25} width={25} />
                }
                text="I don't have any data"
                className="primary sm !justify-start gap-2"
              />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default SettingsPage;
