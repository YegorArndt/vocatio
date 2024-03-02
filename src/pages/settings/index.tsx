import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { BsKeyboard } from "react-icons/bs";

import { api } from "~/utils";
import { Layout } from "~/components/layout/Layout";
import { Spinner } from "~/components";
import { useSettings } from "~/hooks/useSettings";
import { ImportWithLinkedInPopover } from "~/modules/settings/me/ImportWithLinkedInPopover";
import { UploadCvPopover } from "~/modules/settings/me/UploadCvPopover";
import { Button } from "~/components/ui/buttons/Button";

const settings = () => {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { data: user, isSuccess: isUserLoaded } = api.users.get.useQuery();

  useEffect(() => {
    if (settings.hasHydrated) {
      void router.push("/my-info");
      return;
    }

    if (settings.hasHydrated === null && isUserLoaded) {
      updateSettings({ hasHydrated: false });
    }
  }, [settings, user]);

  return (
    <>
      <Head>
        <title>settings</title>
        <meta
          name="description"
          content="settings page for the vacancy creation process"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="breakout">
          {(settings.hasHydrated === null || settings.hasHydrated) && (
            <section className="flex-y flex-center h-[85vh] gap-3">
              <Spinner size={15} /> Loading settings...
            </section>
          )}
          {settings.hasHydrated === false && (
            <section>
              <h1>Ways to import your profile.</h1>
              <p className="clr-ghost">
                Vocatio will use it to generate your CVs.
              </p>
              <div className="flex w-min flex-col gap-4">
                <ImportWithLinkedInPopover />
                <UploadCvPopover />
                <Button
                  frontIcon={<BsKeyboard />}
                  text="Enter manually"
                  className="primary sm !justify-start gap-2"
                />
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

export default settings;
