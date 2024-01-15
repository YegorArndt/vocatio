import { LiaExternalLinkAltSolid } from "react-icons/lia";

import { BlurImage } from "~/components";
import { Link } from "~/components/ui/buttons/Link";
import { usePersistantData } from "~/hooks/usePersistantData";
import { Linkedin } from "~/icons";
import { api, cn } from "~/utils";

export const VacanciesPagePlaceholder = () => {
  const { ls } = usePersistantData();
  const { data: user } = api.users.get.useQuery();

  const bothStepsDone = ls.hasConnectedExtension && user?.contact?.linkedin;

  return (
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
            to="https://chromewebstore.google.com/detail/vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
            baseCn="flex-y clr-blue"
            className={cn({
              "line-through": ls.hasConnectedExtension,
            })}
            frontIcon={<LiaExternalLinkAltSolid />}
            text="Connect chrome extension"
            endIcon={<small className="clr-disabled">~20 seconds</small>}
            newTab
          />
          <Link
            to="/preferences/my-data"
            baseCn="flex-y clr-blue"
            className={cn({
              "line-through": user?.contact?.linkedin,
            })}
            frontIcon={<Linkedin />}
            text="Import LinkedIn profile to start CV generation"
            endIcon={<small className="clr-disabled">~3 minutes</small>}
            newTab
          />
        </>
      )}
      {bothStepsDone && <div>Use the extension to generate your first CV.</div>}
    </section>
  );
};
