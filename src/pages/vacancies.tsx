import Head from "next/head";
import { Fragment } from "react";
import ScrollToTop from "react-scroll-to-top";

import { Lines, CardStack } from "~/components/Spinner";
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
