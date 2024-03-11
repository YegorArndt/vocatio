import Head from "next/head";
import { Fragment } from "react";
import ScrollToTop from "react-scroll-to-top";

import { Lines } from "~/components/Spinner";
import { Layout } from "~/components/layout/Layout";
import { VacanciesPageToolbar } from "~/modules/vacancies/VacanciesPageToolbar";
import { VacanciesContextProvider } from "~/modules/vacancies/VacanciesContext";
import { VacanciesPageHeader } from "~/modules/vacancies/VacanciesPageHeader";
import { VacancyCard } from "~/modules/vacancies/vacancy-card/VacancyCard";
import { VacanciesPagePlaceholder } from "~/modules/vacancies/VacanciesPagePlaceholder";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useConnectExtension } from "~/modules/vacancies/useConnectExtension";

const { log } = console;

const VacanciesPage = () => {
  useConnectExtension();

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
        {(output) => {
          const { loadingVacancies, groupedVacancies, currentGroup } = output;

          const hasVacancies =
            groupedVacancies &&
            !!groupedVacancies[currentGroup]?.vacancies.length;

          return (
            <Layout
              toolbar={loadingVacancies ? <Lines /> : <VacanciesPageToolbar />}
            >
              <main className="mr-8 flex flex-col gap-8">
                {!loadingVacancies && <VacanciesPageHeader />}
                {hasVacancies && (
                  <AnimatedDiv className="flex flex-col gap-4">
                    {groupedVacancies[currentGroup]?.vacancies?.map(
                      (vacancy) => (
                        <VacancyCard key={vacancy.id} vacancy={vacancy} />
                      )
                    )}
                  </AnimatedDiv>
                )}
                {!loadingVacancies && !hasVacancies && (
                  <VacanciesPagePlaceholder />
                )}
              </main>
            </Layout>
          );
        }}
      </VacanciesContextProvider>

      <ScrollToTop smooth color="black" className="flex-center" />
    </Fragment>
  );
};

export default VacanciesPage;
