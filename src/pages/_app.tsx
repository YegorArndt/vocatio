import { useState, useEffect } from "react";
import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { api } from "~/utils";
import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

type Theme = "light" | "dark";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark");

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
        <title>chirp</title>
        <meta
          name="description"
          content="Keep your job applications organized"
        />
        <link rel="icon" href="/fav.webp" />
      </Head>

      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
