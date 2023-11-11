import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";

import { api } from "~/utils";

export const RouteGuard = (
  props: PropsWithChildren<Record<string, unknown>>
) => {
  const { children } = props;
  const router = useRouter();
  const user = api.users.get.useQuery();

  if (!user) {
    void router.push("/login");
    return null;
  }

  return <>{children}</>;
};
