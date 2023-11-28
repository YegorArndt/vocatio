import Head from "next/head";
import { Placeholder } from "~/components/Placeholder";
import { Layout } from "~/components/layout/Layout";
import { VacancyCard } from "~/modules/vacancy/VacancyCard";
import { VacancyCardSkeleton } from "~/modules/vacancy/VacancyCardSkeleton";
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
      <Layout>
        <div className="content">
          {Boolean(isLoading || data?.length) && (
            <div className="card-grid vacancies">
              {isLoading &&
                Array.from({ length: 12 }, (_, i) => (
                  <VacancyCardSkeleton key={i} />
                ))}
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
    </>
  );
};

export default Vacancies;
