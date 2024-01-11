import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import { PartialVacancy, PartialUser } from "~/modules/extension/types";
import { generateDraft } from "~/server/api/utils/draft";
import { setDraftByVacancyId } from "./ls";

export const startCvGeneration = (
  vacancy: PartialVacancy,
  user: PartialUser
) => {
  const { id: vacancyId } = vacancy;

  const linkToCv = `/create/${vacancyId}`;

  toast.loading(`Generating CV`, {
    duration: Infinity,
    id: "loading",
  });

  generateDraft(vacancy, user).then((res) => {
    /**
     * Dismiss loading toast
     */
    toast.dismiss("loading");

    /**
     * Save draft to local storage
     */
    const isSaveSuccessful = setDraftByVacancyId(vacancyId, res);

    if (!isSaveSuccessful) return;

    /**
     * Show success toast
     */
    toast.success(
      <div onClick={() => toast.dismiss("success")} className="flex-y">
        🎉 Success.&nbsp;
        <Link text="View CV" to={linkToCv} className="flex-y gap-1 clr-blue" />
      </div>,
      {
        duration: Infinity,
        dismissible: true,
        id: "success",
      }
    );
  });
};
