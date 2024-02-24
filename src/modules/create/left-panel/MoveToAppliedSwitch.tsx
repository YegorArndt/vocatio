import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "~/components/ui/external/Switch";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { useLs } from "~/hooks/useLs";
import { Events, eventManager } from "~/modules/EventManager";
import { api } from "~/utils";

export const MoveToAppliedSwitch = () => {
  const { generated } = useGeneratedData();
  const { vacancy } = generated || {};

  const { ls, updateLs } = useLs();
  const { mutate: updateVacancy } = api.vacancies.upsert.useMutation();

  const [shouldAutoApplied, setShouldAutoApplied] = useState(false);

  useEffect(() => {
    if (ls.shouldAutoApplied === null) return;
    setShouldAutoApplied(ls.shouldAutoApplied);
  }, [ls.shouldAutoApplied]);

  useEffect(() => {
    if (!shouldAutoApplied) return;

    const handler = () => {
      void updateVacancy({
        id: vacancy?.id,
        group: "applied",
      });
      toast.success("Status changed to ✅ applied");
    };

    eventManager.on(Events.DOWNLOAD_CV_EVENT, handler);

    return () => {
      eventManager.off(Events.DOWNLOAD_CV_EVENT, handler);
    };
  }, [shouldAutoApplied]);

  const onClick = () => {
    setShouldAutoApplied(!shouldAutoApplied);
    updateLs({ shouldAutoApplied: !shouldAutoApplied });
  };

  return (
    <label className="flex-y max-w-[230px] gap-2">
      <Switch checked={shouldAutoApplied} onClick={onClick} />
      Change status to applied after downloading CV
    </label>
  );
};
