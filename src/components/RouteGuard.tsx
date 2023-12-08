import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { publicRoutes } from "~/constants";

import { api } from "~/utils";
import { SpinnerWithLayout } from "./Spinner";

const Auth = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const router = useRouter();
  const { data: user, isLoading } = api.users.get.useQuery();

  useEffect(() => {
    if (!user && !isLoading) void router.push("/login");
  }, [user, isLoading]);

  if (isLoading) return <SpinnerWithLayout />;

  if (!user) return null;

  return <>{children}</>;
};

export const RouteGuard = (
  props: PropsWithChildren<Record<string, unknown>>
) => {
  const { children } = props;
  const router = useRouter();

  if (publicRoutes.includes(router.pathname)) return <>{children}</>;

  return <Auth>{children}</Auth>;
};
