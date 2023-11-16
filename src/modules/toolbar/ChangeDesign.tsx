import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { useDraftContext } from "../draft/DraftContext";
import { Button } from "~/components/ui/buttons/Button";

const src = "/change-design.png";

export const ChangeDesign = () => {
  const {
    dispatchers: { setChangeDesignFired },
    draftState: { CHANGE_DESIGN_FIRED, DOWNLOAD_FIRED },
  } = useDraftContext();

  return (
    <Button
      className="navigation common transform p-1 transition hover:-translate-y-1 motion-reduce:transition-none"
      data-tooltip-id={src}
      onClick={() => setChangeDesignFired(!CHANGE_DESIGN_FIRED)}
      disabled={DOWNLOAD_FIRED}
    >
      <Image
        src={src}
        height={50}
        width={50}
        alt="add"
        className="rounded-lg"
      />
      <Tooltip id={src} place="bottom" content="Change design" />
    </Button>
  );
};
