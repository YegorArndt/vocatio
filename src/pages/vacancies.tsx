import Head from "next/head";
import { SpinnerWithLayout, Placeholder } from "~/components";
import { Layout } from "~/components/layout/Layout";
import { VacancyCard } from "~/modules/vacancy/VacancyCard";
import { api } from "~/utils/api";

export const Vacancies = () => {
  const { data, isLoading } = api.vacancies.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Vacancies - Vocatio</title>
        <meta
          name="description"
          content="Free CV AI builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading && <SpinnerWithLayout />}
      {!isLoading && (
        <Layout>
          <div className="content">
            {data && data.length > 0 && (
              <div className="card-grid vacancies">
                {data?.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
              </div>
            )}
            {Boolean(!isLoading && !data?.length) && (
              <Placeholder
                title="No vacancies found"
                text="Use our Google Extension to add a new vacancy"
                actionContent="Get Extension"
                to="https://chrome.google.com/webstore/detail/Vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
                newTab
              />
            )}
          </div>
        </Layout>
      )}
    </>
  );
};

export default Vacancies;
