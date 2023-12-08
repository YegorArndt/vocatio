import { startCase } from "lodash-es";
import { CiLinkedin } from "react-icons/ci";
import { Link } from "~/components/ui/buttons/Link";
import { api } from "~/utils";
import { EntryFor } from "../types";

type FineTuneLinkProps = {
  entryFor?: EntryFor;
  text?: string;
};

export const FineTuneLink = (props: FineTuneLinkProps) => {
  const { entryFor, text } = props;
  const { data: user, isLoading } = api.users.get.useQuery();

  const linkedinId = user?.contact?.linkedin;
  const linkText = text || `Get ${startCase(entryFor)} from LinkedIn`;
  const to = Boolean(entryFor && linkedinId)
    ? `https://www.linkedin.com/in/${linkedinId}/details/${entryFor}`
    : "https://www.linkedin.com/in/";

  return isLoading ? null : (
    <Link
      frontIcon={<CiLinkedin size={30} />}
      text={linkText}
      to={to}
      className="flex-y gap-1 hover:underline"
      newTab
    />
  );
};
