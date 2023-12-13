import { BlurImage } from "~/components/BlurImage";
import { Button } from "~/components/ui/buttons/Button";
import { downloadPdf } from "../utils";
import { useDraftContext } from "../../draft/DraftContext";
import { Bin } from "../../bin";
import { BsArrowsCollapse } from "react-icons/bs";
import { FaTextHeight } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Divider } from "~/components/layout/Divider";
import { api } from "~/utils";

const { log } = console;

export const Toolbar = () => {
  const { user, vacancy, a4Ref, design, updateDesign } = useDraftContext();
  const { mutate } = api.cvs.create.useMutation({
    onSuccess: (data) => {
      log(data);
    },
  });

  const saveAsDraft = () => mutate(design);

  return (
    <>
      <Button
        text="Download PDF"
        frontIcon={
          <BlurImage
            src="/download-cloud.png"
            alt="Download"
            height={15}
            width={15}
          />
        }
        onClick={() => void downloadPdf(a4Ref, user.name, vacancy.companyName)}
        className="common hover flex-y gap-1"
      />
      <Bin />
      <Button
        frontIcon={<BsArrowsCollapse />}
        text="Condense spacing"
        className="common hover flex-y gap-1"
      />
      <Button
        frontIcon={<FaTextHeight />}
        text="Condense text"
        className="common hover flex-y gap-1"
      />
      <Divider />
      <Button
        frontIcon={<IoIosCheckmarkCircleOutline />}
        text="Save as draft"
        className="common hover flex-y gap-1"
        onClick={saveAsDraft}
      />
    </>
  );
};
