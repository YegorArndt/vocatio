import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/react-menu.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import "~/styles/globals.css";
import { api } from "~/utils";
import { Toaster } from "~/components/ui/external/Sonner";
import { useTheme } from "~/hooks/useTheme";

const MyApp: AppType = ({ Component, pageProps }) => {
  useTheme();

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
      <Component {...pageProps} />{" "}
      <Toaster position="bottom-left" theme="light" />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
