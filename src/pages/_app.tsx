import { useState, useEffect } from "react";
import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { api } from "~/utils";
import "~/styles/globals.css";
import { ModalFactory } from "~/modules/modal/ModalFactory";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type Theme = "light" | "d";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("d");

  /**
   * Get theme from local storage
   */
  useEffect(() => {
    const theme = localStorage.getItem("theme") as Theme;
    if (theme) setTheme(theme);
  }, []);

  /**
   * Set theme on local storage
   */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    /**
     * Set it on body
     */
    const body = document.body;
    body.dataset.theme = theme;
    body.classList.add(inter.className);
  }, [theme]);

  return [theme, setTheme] as const;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const [theme, setTheme] = useTheme();
  const { isError } = api.users.get.useQuery();

  const router = useRouter();

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError]);

  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Vocatio</title>
        <meta
          name="description"
          content="Create CVs and Resumes tailored to job requirements."
        />
        <link rel="icon" href="/fav.webp" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer theme="dark" position="bottom-left" />
      <ModalFactory />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
