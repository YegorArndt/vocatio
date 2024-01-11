import Head from "next/head";
import { Fragment } from "react";
import ScrollToTop from "react-scroll-to-top";

import { Lines, CardStack } from "~/components/Spinner";
import { Layout } from "~/components/layout/Layout";
import { VacanciesPageToolbar } from "~/modules/vacancies/VacanciesPageToolbar";
import { VacanciesContextProvider } from "~/modules/vacancies/VacanciesContext";
import { VacanciesPageHeader } from "~/modules/vacancies/VacanciesPageHeader";
import { VacancyCard } from "~/modules/vacancies/vacancy-card/VacancyCard";

const { log } = console;

const Vacancies = () => {
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
        {({ loadingVacancies, groupedVacancies, currentGroup }) => (
          <Layout
            toolbar={loadingVacancies ? <Lines /> : <VacanciesPageToolbar />}
          >
            <div className="content flex flex-col gap-8">
              <VacanciesPageHeader />
              {loadingVacancies && <CardStack className="vacancies" />}
              <div className="card-grid vacancies">
                {groupedVacancies[currentGroup]?.vacancies?.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
              </div>
            </div>
          </Layout>
        )}
      </VacanciesContextProvider>

      {/* {!userLoading && filteredByGroup && filteredByGroup.length > 0 && (
            <div className="card-grid vacancies">
              {filteredByGroup.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  availableGroups={availableGroups}
                />
              ))}
            </div>
          )}
          {!userLoading && vacancies && vacancies.length === 0 && (
            <section className="flex-y flex-col gap-3">
              <header className="flex-y gap-3">
                <BlurImage
                  src="/loading-cat.gif"
                  height={50}
                  width={50}
                  className="rounded-md"
                  alt=""
                />
                <h3>Next steps</h3>
              </header>
              <Link
                to="https://chromewebstore.google.com/detail/vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
                className="flex-y clr-blue"
                frontIcon={<LiaExternalLinkAltSolid />}
                text="Get chrome extension"
                endIcon={<small className="clr-disabled">~20 seconds</small>}
                newTab
              />
              <Link
                to="/preferences/my-data"
                className="flex-y clr-blue"
                frontIcon={<Linkedin />}
                text="Import LinkedIn profile to start CV generation"
                endIcon={<small className="clr-disabled">~3 minutes</small>}
                newTab
              />
            </section>
          )}
        </div> */}
      <ScrollToTop smooth color="black" className="flex-center" />
    </Fragment>
  );
};

export default Vacancies;
