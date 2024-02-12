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

const { log } = console;

const InitGenerationPage = () => {
  const { sendMessage, hasSent, response } = useSendMessage();
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();

  const { mutate: createVacancy } = api.vacancies.create.useMutation({
    onSuccess: () => {
      toast.success("Vacancy added to dashboard.");
    },
  });

  useEffect(() => {
    if (!hasSent) sendMessage({ type: "get-vacancy" });
    if (!user) return;

    if (response.success) {
      if (!user) {
        toast.error(
          "Aborting. Missing user data. Vocatio will try to load it again."
        );
        void router.push("/preferences");
        return;
      }

      const { newVacancy } = response.data!;

      void initDraft({
        vacancy: newVacancy,
        user,
        handleExistingDraft: () => {
          toast.error(
            "Aborting. A draft for this vacancy already exists. Please delete it and try again."
          );
          void router.push(`/create/${newVacancy.id}`);
        },
        onComplete: (generatedDraft) => {
          //@ts-ignore
          createVacancy({
            ...newVacancy,
            responsibilities: generatedDraft.vacancyResponsibilities,
            requiredSkills: generatedDraft.vacancySkills,
          });
        },
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
          <Spinner size={12} /> Redirecting to CV Editor...
        </AnimatedDiv>
      )}
    </>
  );
};

export default InitGenerationPage;
