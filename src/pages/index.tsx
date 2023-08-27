import Head from "next/head";
import { VacancyCard } from "~/components";
import { api } from "~/utils/api";

export default function Home() {
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
      <main className="grid grid-cols-2 gap-10 p-5">
        {isLoading && <p>Loading...</p>}
        {data?.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </main>
    </>
  );
}
