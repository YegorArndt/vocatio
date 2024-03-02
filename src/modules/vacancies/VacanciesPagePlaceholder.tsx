import { BlurImage } from "~/components";
import { Link } from "~/components/ui/buttons/Link";
import { useSettings } from "~/hooks/useSettings";
import { api, cn } from "~/utils";
import { useVacanciesContext } from "./VacanciesContext";
import { Linkedin } from "~/components/icons";
import { FaChrome } from "react-icons/fa";

export const VacanciesPagePlaceholder = () => {
  const { currentGroup } = useVacanciesContext();
  const { settings } = useSettings();
  const { data: user } = api.users.get.useQuery();

  const stepOneDone = settings.hasConnectedExtension;
  const stepTwoDone =
    user?.experience?.length !== 0 ||
    user?.education?.length !== 0 ||
    user?.skills?.length !== 0;

  const bothStepsDone = stepOneDone && stepTwoDone;

  return currentGroup === "all" ? (
    <section className="flex-y flex-col gap-3">
      <header className="flex-y gap-3">
        {bothStepsDone && <>🎉</>}
        {!bothStepsDone && (
          <BlurImage
            src="/loading-cat.gif"
            height={50}
            width={50}
            className="rounded-md"
            alt=""
          />
        )}
        <h3>{bothStepsDone ? "All done" : "Next steps"}</h3>
      </header>
      {!bothStepsDone && (
        <>
          <Link
            to="/connect-extension"
            baseCn="flex-y clr-blue"
            className={cn({
              "line-through": stepOneDone,
            })}
            frontIcon={<FaChrome />}
            text="Connect chrome extension"
            endIcon={<small className="clr-disabled">~20 seconds</small>}
          />
          <Link
            to="/settings"
            baseCn="flex-y clr-blue"
            className={cn({
              "line-through": stepTwoDone,
            })}
            frontIcon={<Linkedin />}
            text="Import your profile"
            endIcon={<small className="clr-disabled">~3 minutes</small>}
          />
        </>
      )}
      {bothStepsDone && <div>Use the extension to generate your first CV.</div>}
    </section>
  ) : (
    <section className="flex-y flex-col gap-2">
      <h3>Empty</h3>
      <div className="flex-y gap-3">
        <BlurImage
          src="/loading-cat.gif"
          height={25}
          width={25}
          className="rounded-md"
          alt=""
        />
        Empty groups are deleted after refreshing the page.
      </div>
    </section>
  );
};
