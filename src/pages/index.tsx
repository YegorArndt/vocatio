import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProgressIncrementer } from "~/components/ProgressIncrementer";

const Home = () => {
  const router = useRouter();
  const [canFinish, setCanFinish] = useState(false);

  useEffect(() => {
    void router.push("/vacancies");

    return () => {
      setCanFinish(true);
    };
  }, []);

  return <ProgressIncrementer canFinish={canFinish} />;
};

export default Home;
