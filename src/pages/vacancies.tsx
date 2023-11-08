import Head from "next/head";
import { VacancyCard } from "~/components";
import { LogoLoader } from "~/components/LogoLoader";
import { Placeholder } from "~/components/Placeholder";
import { Layout } from "~/components/layout/Layout";
import { api } from "~/utils/api";

export const Vacancies = () => {
  const { data, isLoading } = api.vacancies.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Careerpilot</title>
        <meta
          name="description"
          content="Free CV AI builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isLoading && <LogoLoader />}
        {data && (
          <div className="grid-container container gap-x-[2rem] gap-y-[3rem] pt-[5rem]">
            {data?.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        )}
        {!isLoading && !data && (
          <Placeholder
            title="No vacancies found"
            text="Use the extension to add a new vacancy"
          />
        )}
      </Layout>
    </>
  );
};

export default Vacancies;
