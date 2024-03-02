import Head from "next/head";
import { useEffect } from "react";

import { ExtensionResponse, useSendMessage } from "~/hooks/useSendMessage";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { api, somethingWentWrong } from "~/utils";
import { useSettings } from "~/hooks/useSettings";
import { init } from "~/modules/create/tailor/init";
import { tailorExperience } from "~/modules/create/tailor/tailorExperience";
import { tailorSkills } from "~/modules/create/tailor/tailorSkills";
import { Common } from "~/modules/create/tailor/types";
import { finish } from "~/modules/create/tailor/finish";
import { PartialVacancy } from "~/modules/types";
import { Gen } from "~/modules/init-gen/types";

const { log } = console;

const tailor = async (props: Common) => {
  init(props);

  const [skills, experience] = await Promise.all([
    tailorSkills(props),
    tailorExperience(props),
  ]);

  const updatedGen = finish({
    ...skills,
    ...experience,
    user: props.user,
  });

  return updatedGen;
};

const InitGenerationPage = () => {
  const { sendMessage, hasSent, response } = useSendMessage();
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();
  const { updateSettings } = useSettings();
  const { mutate } = api.vacancies.create.useMutation({
    onSuccess: () => {
      toast.success("Vacancy added to dashboard.");
    },
  });

  const shouldReturnEarly = (response: ExtensionResponse) => {
    if (!user) {
      toast.error("Aborting. Missing CV data.", {
        description: "Vocatio will try to load it again.",
      });
      void router.push("/settings");
      return true;
    }

    // const vacancyAlreadyHasCv = cvContextManager.getItem(
    //   CvContext.GEN,
    //   response.data?.newVacancy.id
    // );

    // if (vacancyAlreadyHasCv) {
    //   const { id } = vacancyAlreadyHasCv.vacancy;
    //   void router.push(`/create/${id}`);
    //   return true;
    // }

    const hasLostConnectionContext = !response.data?.newVacancy?.id;
    if (hasLostConnectionContext) {
      toast.error(
        "You've probably turned on the extension recently. Please close all Vocatio and LinkedIn tabs and try again."
      );
      return true;
    }

    const firstEntry = user?.experience[0];

    if (firstEntry) {
      updateSettings({ modifiableItems: [firstEntry.id] });
    }
  };

  const createVacancy = (gen: Gen | undefined) => {
    if (!gen) {
      somethingWentWrong();
      return;
    }

    const vacancy: PartialVacancy = {
      ...gen.vacancy,
      responsibilities: gen.vacancyResponsibilities,
      requiredSkills: gen.vacancySkills,
    };

    // @ts-ignore
    mutate(vacancy);
  };

  useEffect(() => {
    if (!hasSent) sendMessage({ type: "get-vacancy" });
    if (!user) return;

    if (response.success) {
      if (shouldReturnEarly(response)) return;

      const { newVacancy } = response.data!;

      tailor({ user, vacancy: newVacancy }).then(createVacancy);

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
