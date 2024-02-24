import { api } from "~/utils";
import { useEffect, useState } from "react";
import { Autoresize } from "../design/base-components/Autoresize";
import { useComponentContext } from "../design/contexts/ComponentContext";
import { useDesignContext } from "../design/contexts/DesignContext";

const { log } = console;

const PROFESSIONAL_SUMMARY_CN = "text-[12px]";

export const DefaultProfessionalSummary = () => {
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();
  const [summary, setSummary] = useState("");

  const { design } = useDesignContext();
  const c = useComponentContext();

  useEffect(() => {
    if (!user?.professionalSummary) return;

    setSummary(user.professionalSummary);
  }, [user]);

  if (isUserLoading)
    return (
      <section className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[10px] w-full animate-pulse rounded-md bg-grayD"
          />
        ))}
      </section>
    );

  const professionalSummary = {
    className:
      design.baseComponents?.professionalSummary?.className ??
      PROFESSIONAL_SUMMARY_CN,
    value: summary,
    ...c.hydratedProps,
  };

  return <Autoresize {...professionalSummary} />;
};
