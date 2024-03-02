import { toast } from "sonner";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { tailorSkills } from "./tailorSkills";
import { tailorExperience } from "./tailorExperience";
import { RouterUser } from "~/modules/types";
import { somethingWentWrong } from "~/utils";
import { Gen } from "~/modules/init-gen/types";
import { CvContextManager } from "~/modules/CvContextManager";

type FinishProps = Awaited<ReturnType<typeof tailorSkills>> &
  Awaited<ReturnType<typeof tailorExperience>> & { user: RouterUser };

export const finish = (props: FinishProps) => {
  if (!localStorage) return;

  const instance = CvContextManager.getInstance();

  const initialGen = instance.getGen();

  if (!initialGen) {
    somethingWentWrong();
    return;
  }

  const { user, ...withoutUser } = props;

  const updatedGen: Gen = {
    ...initialGen,
    ...withoutUser,
  };

  try {
    instance.setGen(updatedGen);
    eventManager.emit(Events.GEN_UPDATED);
    toast.success("Success. Please review.");

    return updatedGen;
  } catch (e) {
    const isLsQuotaExceededError =
      e instanceof DOMException && e.name === "QuotaExceededError";

    if (isLsQuotaExceededError)
      toast.error(
        "You've reached the free limit. Consider purchasing 100 more generations (+ cover letters) for $4.99",
        {
          duration: Infinity,
        }
      );
  }
};
