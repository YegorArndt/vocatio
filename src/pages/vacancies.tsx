import Head from "next/head";
import { VacancyCard } from "~/components";
import { LogoLoader } from "~/components/LogoLoader";
import { Layout } from "~/components/layout/Layout";
import { api } from "~/utils/api";

export const Vacancies = () => {
  const { data, isLoading } = api.vacancies.getAll.useQuery();

  return (
    <>
      <Head>
        <title>chirp</title>
        <meta
          name="description"
          content="Keep your job applications organized"
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
      </Layout>
    </>
  );
};

export default Vacancies;
