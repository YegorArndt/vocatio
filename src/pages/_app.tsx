import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { api } from "~/utils";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
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
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
