import { api, cn } from "~/utils";
import { Link, LinkProps } from "./ui/buttons/Link";
import { linkedinJobsSearchUrl } from "~/modules/constants";
import { LinkedinColor } from "./icons";

export const BrowseVacanciesLink = (props: Omit<LinkProps, "to">) => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const to =
    user?.vacancies.find((v) => v.sourceUrl)?.sourceUrl ||
    linkedinJobsSearchUrl;

  return (
    <Link
      baseCn="primary"
      className={cn({
        "pointer-events-none opacity-50": userLoading,
      })}
      newTab
      {...props}
      to={to}
    >
      <LinkedinColor fontSize={20} />
      Browse vacancies
    </Link>
  );
};
