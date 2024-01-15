import { LiaExternalLinkAltSolid } from "react-icons/lia";

import { BlurImage } from "~/components";
import { Link } from "~/components/ui/buttons/Link";
import { Linkedin } from "~/icons";

export const VacanciesPagePlaceholder = () => {
  return (
    <section className="flex-y flex-col gap-3">
      <header className="flex-y gap-3">
        <BlurImage
          src="/loading-cat.gif"
          height={50}
          width={50}
          className="rounded-md"
          alt=""
        />
        <h3>Next steps</h3>
      </header>
      <Link
        to="https://chromewebstore.google.com/detail/vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
        className="flex-y clr-blue"
        frontIcon={<LiaExternalLinkAltSolid />}
        text="Get chrome extension"
        endIcon={<small className="clr-disabled">~20 seconds</small>}
        newTab
      />
      <Link
        to="/preferences/my-data"
        className="flex-y clr-blue"
        frontIcon={<Linkedin />}
        text="Import LinkedIn profile to start CV generation"
        endIcon={<small className="clr-disabled">~3 minutes</small>}
        newTab
      />
    </section>
  );
};
