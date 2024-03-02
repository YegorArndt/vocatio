import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "~/components/ui/external/Switch";
import { useSettings } from "~/hooks/useSettings";
import { CvContextManager } from "~/modules/CvContextManager";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { api } from "~/utils";

export const MoveToAppliedSwitch = () => {
  const { settings, updateSettings } = useSettings();
  const { mutate: updateVacancy } = api.vacancies.upsert.useMutation();

  const [shouldAutoApplied, setShouldAutoApplied] = useState(false);

  useEffect(() => {
    if (settings.shouldAutoApplied === null) return;
    setShouldAutoApplied(settings.shouldAutoApplied);
  }, [settings.shouldAutoApplied]);

  useEffect(() => {
    if (!shouldAutoApplied) return;

    const handler = () => {
      const vacancy = CvContextManager.getInstance().getVacancy();

      void updateVacancy({
        id: vacancy?.id,
        group: "applied",
      });
      toast.success("Status changed to ✅ applied");
    };

    eventManager.on(Events.DOWNLOAD_FIRED, handler);

    return () => {
      eventManager.off(Events.DOWNLOAD_FIRED, handler);
    };
  }, [shouldAutoApplied]);

  const onClick = () => {
    setShouldAutoApplied(!shouldAutoApplied);
    updateSettings({ shouldAutoApplied: !shouldAutoApplied });
  };

  return (
    <label className="flex-y max-w-[230px] gap-2">
      <Switch checked={shouldAutoApplied} onClick={onClick} />
      Change status to applied after downloading CV
    </label>
  );
};
