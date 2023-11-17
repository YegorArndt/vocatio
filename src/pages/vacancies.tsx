import Head from "next/head";
import { VacancyCard } from "~/components";
import { Placeholder } from "~/components/Placeholder";
import { Layout } from "~/components/layout/Layout";
import { VacancyCardSkeleton } from "~/modules/vacancy/VacancyCardSkeleton";
import { api } from "~/utils/api";

export const Vacancies = () => {
  const { data, isLoading } = api.vacancies.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Vocatio</title>
        <meta
          name="description"
          content="Free CV AI builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {Boolean(isLoading || data?.length) && (
          <div className="grid-container container gap-x-[2rem] gap-y-[3rem] pt-[5rem]">
            {isLoading &&
              Array.from({ length: 6 }, (_, i) => (
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
            linkText="Get Extension"
            to="https://chrome.google.com/webstore/detail/Vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
            newTab
          />
        )}
      </Layout>
    </>
  );
};

export default Vacancies;
