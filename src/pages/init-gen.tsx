import Head from "next/head";
import { useEffect, useState } from "react";

import { api } from "~/utils";
import { startCvGeneration } from "~/utils/startCvGeneration";
import { useSendMessage } from "~/hooks/useSendMessage";
import { usePersistentData } from "~/hooks/usePersistentData";
import { updatePersistedState } from "~/utils/ls";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";

const { log } = console;

const InitGenerationPage = () => {
  const { sendMessage, hasSent, response } = useSendMessage();

  const {
    mutate: createVacancy,
    isLoading: creatingVacancy,
    isSuccess: createdVacancy,
  } = api.vacancies.create.useMutation();

  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: user,
    refetch: refetchUser,
    isRefetching,
  } = api.users.get.useQuery();
  const { ls } = usePersistentData();

  const router = useRouter();

  useEffect(() => {
    if (!hasSent) sendMessage({ type: "get-vacancy" });

    if (response.success && response.data) {
      const { newVacancy } = response.data;
      if (!newVacancy) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      /**
       * Create new vacancy
       */
      if (!createdVacancy && !creatingVacancy) createVacancy(newVacancy);

      /**
       * Start generation if user found in ls.
       */
      if (!isGenerating && ls.user) {
        startCvGeneration({ vacancy: newVacancy });
        setIsGenerating(true);
      }

      /**
       * Update user in ls if none found.
       */
      if (!ls.user && user && !isGenerating) {
        updatePersistedState((old) => ({
          ...old,
          user,
        }));

        toast.loading("Preparing your data...", { id: "preparing" });
      }

      if (isGenerating) {
        toast.dismiss("preparing");
      }

      if (createdVacancy) {
        refetchUser().then(() => {
          router.push("/vacancies");
        });
      }
    }
  }, [response.success, user, ls.user, createdVacancy, isGenerating]);

  return (
    <>
      <Head>
        <title>Generating CV...</title>
      </Head>
      <ProgressIncrementer fixToTop canFinish={createdVacancy} shouldHide />
    </>
  );
};

export default InitGenerationPage;
