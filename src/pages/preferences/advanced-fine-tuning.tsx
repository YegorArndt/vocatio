import Head from "next/head";

import { Layout } from "~/components/layout/Layout";
import { ProfessionalSummary } from "~/modules/preferences/boxes/components/ProfessionalSummary";
import { VocatioUrl } from "~/modules/preferences/boxes/components/VocatioUrl";
import { preferencesToolbar } from "~/modules/preferences/constants";

export const AdvancedFineTuning = () => {
  return (
    <>
      <Head>
        <title>Advanced fine-tuning - Vocatio</title>
        <meta name="description" content="Fine-tune your Vocatio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        <div className="two-col-grid">
          <div className="main-center">
            <h1>Advanced Fine-tuning.</h1>
            <p>
              If you wish to further customize Vocatio's adjustments take a look
              at the tools here.
            </p>
            <div className="flex flex-col gap-8">
              <ProfessionalSummary />
              <VocatioUrl />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdvancedFineTuning;
