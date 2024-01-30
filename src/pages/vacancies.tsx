import Head from "next/head";
import { Fragment, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";

import { Lines, CardStack } from "~/components/Spinner";
import { Layout } from "~/components/layout/Layout";
import { VacanciesPageToolbar } from "~/modules/vacancies/VacanciesPageToolbar";
import { VacanciesContextProvider } from "~/modules/vacancies/VacanciesContext";
import { VacanciesPageHeader } from "~/modules/vacancies/VacanciesPageHeader";
import { VacancyCard } from "~/modules/vacancies/vacancy-card/VacancyCard";
import { VacanciesPagePlaceholder } from "~/modules/vacancies/VacanciesPagePlaceholder";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useSendMessage } from "~/hooks/useSendMessage";
import { usePersistentData } from "~/hooks/usePersistentData";
import { api } from "~/utils";
import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import { extensionUrl } from "~/constants";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { useRouter } from "next/router";

const { log } = console;

const VacanciesPage = () => {
  const { ls, updateLs } = usePersistentData();
  const { data: user, isError: errorGettingUser } = api.users.get.useQuery(
    undefined,
    { retry: false }
  );
  const { sendMessage, hasSent, response, isInstalled } = useSendMessage();
  const router = useRouter();

  useEffect(() => {
    if (errorGettingUser) {
      toast.dismiss("extension-not-installed");
      toast.dismiss("connecting");
      toast.info("Redirecting to login...");
      void router.push("/login");
    }

    if (user) {
      if (user && ls.user && !ls.hasConnectedExtension) {
        /**
         * Ping the extension to check if it's installed.
         */
        if (!hasSent) {
          sendMessage({ type: "post-user", payload: { user } });
          if (isInstalled)
            toast.loading("Connecting the extension...", {
              id: "connecting",
              duration: Infinity,
            });
        }

        /**
         * Show toast if the extension is not installed.
         */
        if (!isInstalled) {
          toast.dismiss("connecting");
          toast.error("Extension not installed.", {
            id: "extension-not-installed",
            duration: Infinity,
            description: (
              <Link
                frontIcon={<LiaExternalLinkAltSolid size={15} />}
                text="Install from Google Web Store."
                to={extensionUrl}
                className="flex-y clr-blue"
                onClick={() => toast.dismiss("extension-not-installed")}
                newTab
              />
            ),
          });
        }

        /**
         * Notify the user that the extension is connected and update the ls.
         */
        if (response.success) {
          updateLs({ hasConnectedExtension: true });
          toast.dismiss("connecting");
          toast.dismiss("extension-not-installed");
          toast.success("Extension connected.");
        }
      }
    }
  }, [user, ls.user, response.success, errorGettingUser, isInstalled]);

  return (
    <Fragment>
      <Head>
        <title>Vacancies - Vocatio</title>
        <meta
          name="description"
          content="Free AI based CV builder. Generate CVs tailored to the job description."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VacanciesContextProvider>
        {({ loadingVacancies, groupedVacancies, currentGroup }) => {
          const hasVacancies =
            groupedVacancies &&
            !!groupedVacancies[currentGroup]?.vacancies.length;

          const showPlaceholder = !loadingVacancies && !hasVacancies;

          return (
            <Layout
              toolbar={loadingVacancies ? <Lines /> : <VacanciesPageToolbar />}
            >
              <div className="content flex flex-col gap-8">
                <VacanciesPageHeader />
                {loadingVacancies && <CardStack className="vacancies" />}
                {hasVacancies && (
                  <AnimatedDiv className="card-grid vacancies">
                    {groupedVacancies[currentGroup]?.vacancies?.map(
                      (vacancy) => (
                        <VacancyCard key={vacancy.id} vacancy={vacancy} />
                      )
                    )}
                  </AnimatedDiv>
                )}
                {showPlaceholder && <VacanciesPagePlaceholder />}
              </div>
            </Layout>
          );
        }}
      </VacanciesContextProvider>

      <ScrollToTop smooth color="black" className="flex-center" />
    </Fragment>
  );
};

export default VacanciesPage;
