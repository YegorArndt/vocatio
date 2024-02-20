import Head from "next/head";
import { useEffect } from "react";

import { useSendMessage } from "~/hooks/useSendMessage";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { initDraft } from "~/modules/init-gen/utils";
import { api } from "~/utils";
import { useLs } from "~/hooks/useLs";
import { GeneratedData } from "~/modules/init-gen/types";
import { setLsGeneratedData } from "~/utils/ls";

const { log } = console;

const useOnComplete = () => {
  const { mutate: createVacancy } = api.vacancies.create.useMutation({
    onSuccess: () => {
      toast.success("Vacancy added to dashboard.");
    },
  });

  return (gen: GeneratedData) => {
    setLsGeneratedData(gen);

    //@ts-ignore
    createVacancy({
      ...gen.vacancy,
      responsibilities: gen.vacancyResponsibilities,
      requiredSkills: gen.vacancySkills,
    });
  };
};

const InitGenerationPage = () => {
  const { sendMessage, hasSent, response } = useSendMessage();
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();
  const { ls, updateLs } = useLs();

  const onComplete = useOnComplete();

  const handleExistingDraft = () => {
    toast.error(
      "Aborting. A draft for this vacancy already exists. Please delete it and try again."
    );
    void router.push(`/create/${response.data?.newVacancy?.id}`);
  };

  const handleMissingCvData = () => {
    toast.error(
      "Aborting. Missing CV data. Vocatio will try to load it again."
    );
    void router.push("/preferences");
  };

  const handleModifiableEntry = () => {
    const firstEntry = user?.experience[0];

    if (firstEntry) {
      updateLs({ modifiableItems: [firstEntry.id] });
    }
  };

  useEffect(() => {
    if (!hasSent) sendMessage({ type: "get-vacancy" });
    if (!user) return;

    if (response.success) {
      if (!user) return handleMissingCvData();
      handleModifiableEntry();

      const hasLostConnectionContext = !response.data?.newVacancy?.id;
      if (hasLostConnectionContext) {
        toast.error(
          "You've probably turned on the extension recently. Please close all Vocatio and LinkedIn tabs and try again."
        );
        return;
      }

      const { newVacancy } = response.data!;

      void initDraft({
        vacancy: newVacancy,
        user,
        handleExistingDraft,
        onComplete,
      });

      void router.push(`/create/${newVacancy.id}`);
    }
  }, [response.success, user]);

  return (
    <>
      <Head>
        <title>Initializing...</title>
      </Head>
      <ProgressIncrementer
        fixToTop
        canFinish={response.success && !!user}
        shouldHide
      />
      {!response.success && (
        <AnimatedDiv className="flex-center h-[95vh] gap-3">
          <Spinner size={12} /> Initializing...
        </AnimatedDiv>
      )}
      {response.success && (
        <AnimatedDiv className="flex-center h-[95vh] gap-3">
          Redirecting to CV Editor...
        </AnimatedDiv>
      )}
    </>
  );
};

export default InitGenerationPage;
