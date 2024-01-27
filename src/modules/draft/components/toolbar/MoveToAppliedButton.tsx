import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/buttons/Button";
import { usePersistentData } from "~/hooks/usePersistentData";
import { api } from "~/utils";

export const MoveToAppliedButton = (props: { vacancyId: string }) => {
  const { vacancyId } = props;
  const { updateLs } = usePersistentData();
  const { register, watch } = useForm();

  const { mutate: updateVacancy, isLoading } =
    api.vacancies.upsert.useMutation();

  const moveToApplied = (shouldMove: boolean) => {
    toast.dismiss("move-to-applied");

    const shouldAutoMoveToApplied = watch("shouldAutoMoveToApplied");

    if (shouldAutoMoveToApplied) {
      updateLs({
        shouldAutoMoveToApplied,
      });
    }

    if (!shouldMove) return;

    void updateVacancy({
      id: vacancyId,
      group: "applied",
    });
    toast.success("Moved to ✅ applied");
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex-y gap-2">
        Move vacancy to applied?
        {[<>✅</>, <>❌</>].map((icon, index) => (
          <Button
            key={index}
            onClick={() => moveToApplied(index === 0)}
            baseCn="!cursor-pointer rounded-md"
            disabled={isLoading}
          >
            {icon}
          </Button>
        ))}
      </div>
      <label className="flex-y gap-2 text-[12px]">
        <input type="checkbox" {...register("shouldAutoMoveToApplied")} />
        Always move to applied
      </label>
    </div>
  );
};
