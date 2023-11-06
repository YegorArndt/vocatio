import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push("/vacancies");
  }, []);
};

export default Home;
