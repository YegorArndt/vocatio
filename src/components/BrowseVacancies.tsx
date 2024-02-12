import { api, cn } from "~/utils";
import { Link, LinkProps } from "./ui/buttons/Link";
import { linkedinJobsSearchUrl } from "~/modules/constants";
import { LinkedinColor } from "./icons";

export const BrowseVacanciesLink = (props: Omit<LinkProps, "to">) => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  return (
    <Link
      frontIcon={<LinkedinColor />}
      text="Browse vacancies"
      baseCn="common hover flex-y gap-2"
      className={cn({
        "pointer-events-none opacity-50": userLoading,
      })}
      newTab
      {...props}
      to={
        user?.vacancies.find((v) => v.sourceUrl)?.sourceUrl ||
        linkedinJobsSearchUrl
      }
    />
  );
};
