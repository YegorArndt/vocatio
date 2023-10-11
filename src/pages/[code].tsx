import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

const RedirectPage = ({ url }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
  }, []);

  return <div>Redirecting...</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code;

  if (typeof code !== "string") {
    return { notFound: true };
  }

  const url = await prisma.url.findUnique({
    where: {
      shortCode: code,
    },
  });

  if (!url) {
    return { notFound: true };
  }

  return {
    props: { url: url.original },
  };
};

export default RedirectPage;
