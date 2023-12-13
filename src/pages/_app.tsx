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
import { RouteGuard } from "~/components";

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
     * Set it on html
     */
    const htmlTag = document.documentElement;
    htmlTag.dataset.theme = theme;
    htmlTag.classList.add(inter.className);
  }, [theme]);

  return [theme, setTheme] as const;
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const [theme, setTheme] = useTheme();

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
      <RouteGuard>
        <Component {...pageProps} />
        <ToastContainer theme="dark" position="bottom-left" />
      </RouteGuard>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
