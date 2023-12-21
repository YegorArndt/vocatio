import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push("/login");
  }, []);

  return null;
};

export default Home;
