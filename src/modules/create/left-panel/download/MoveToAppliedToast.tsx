import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/buttons/Button";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { useLs } from "~/hooks/useLs";
import { api } from "~/utils";

export const MoveToAppliedToast = () => {
  const { generated } = useGeneratedData();
  const { vacancy } = generated || {};

  const { ls, updateLs } = useLs();
  const { register, watch } = useForm();

  const { mutate: updateVacancy, isLoading: isMovingVacancy } =
    api.vacancies.upsert.useMutation();

  const moveToApplied = (shouldMove: boolean) => {
    toast.dismiss();

    const shouldAutoApplied = watch("shouldAutoApplied");

    if (shouldAutoApplied) {
      updateLs({
        shouldAutoApplied,
      });
    }

    if (!shouldMove) return;

    void updateVacancy({
      id: vacancy?.id,
      group: "applied",
    });
    toast.success("Moved to ✅ applied");
  };

  useEffect(() => {
    if (ls.shouldAutoApplied && !isMovingVacancy) {
      moveToApplied(true);
    }
  }, [ls.shouldAutoApplied]);

  return ls.shouldAutoApplied ? (
    <div>Moved to ✅ applied </div>
  ) : (
    <div className="flex w-full flex-col gap-2">
      <div className="flex-y gap-2">
        Move vacancy to applied?
        {[<>✅</>, <>❌</>].map((icon, index) => (
          <Button
            key={index}
            onClick={() => moveToApplied(index === 0)}
            baseCn="!cursor-pointer rounded-md"
            disabled={isMovingVacancy}
          >
            {icon}
          </Button>
        ))}
      </div>
      <label className="flex-y gap-2 text-[12px]">
        <input type="checkbox" {...register("shouldAutoApplied")} />
        Always move to applied
      </label>
    </div>
  );
};
