import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import { useSettings } from "~/hooks/useSettings";
import { linkedinJobsSearchUrl } from "~/modules/constants";
import { RouterUser } from "~/modules/types";
import { api } from "~/utils";

export const getMissingInfo = (user: RouterUser) => {
  const keys: (keyof RouterUser)[] = [
    "contact",
    "education",
    "experience",
    "languages",
    "skills",
    "professionalSummary",
  ];

  // @ts-ignore
  return keys.filter((key) => !user[key]?.length);
};

export const useCongratUser = () => {
  const { settings, updateSettings } = useSettings();
  const { data: user } = api.users.get.useQuery();

  useEffect(() => {
    if (
      !user ||
      settings.hasShownCongratsMessage ||
      settings.hasShownCongratsMessage === null
    )
      return;

    const missingInfo = getMissingInfo(user);

    if (missingInfo.length === 0) {
      updateSettings({ hasShownCongratsMessage: true });
      toast.dismiss();
      toast.success(
        <div className="flex-y gap-3">
          <Image
            src="/wow.jpg"
            height={50}
            width={50}
            alt=""
            className="rounded-full"
          />
          <div>
            Wow. So much info. <br />
            <small className="inline">
              Congrats!{" "}
              <Link
                frontIcon="👉"
                text="Open any vacancy"
                to={linkedinJobsSearchUrl}
                className="inline clr-blue"
                newTab
              />{" "}
              and use the extension to generate your first CV.
            </small>
          </div>
        </div>,
        { duration: 20000 }
      );
    }
  }, [user]);
};
