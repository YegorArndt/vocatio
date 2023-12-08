import { useRouter } from "next/router";
import { useEffect } from "react";
import { SpinnerWithLayout } from "~/components";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push("/vacancies");
  }, []);

  return <SpinnerWithLayout />;
};

export default Home;
