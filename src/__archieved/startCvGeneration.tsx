// import { toast } from "sonner";
// import { Link } from "~/components/ui/buttons/Link";
// import {
//   Models,
//   PartialVacancy,
// } from "~/modules/create/design/extension/types";
// import { generateDraft } from "~/__archieved/generate-cv";
// import { getPersistedState, setLsGeneratedData } from "./ls";
// import { LiaExternalLinkAltSolid } from "react-icons/lia";
// import { getMissingInfo } from ".";

// type StartCvGenerationProps = {
//   vacancy: PartialVacancy;
//   model?: Models;
// };

// export const startCvGeneration = (props: StartCvGenerationProps) => {
//   let { vacancy, model } = props;

//   if (!vacancy.description) {
//     toast.error("Aborting: vacancy description missing.", {
//       description:
//         "You might have started the generation before the page was fully loaded. Please try again.",
//     });
//     return;
//   }

//   model = getPersistedState().defaultModel;

//   const { id: vacancyId } = vacancy;
//   const { user } = getPersistedState();

//   const canGenerate = user && user.experience?.length && user.skills?.length;

//   if (!canGenerate) {
//     const id = toast.error("Aborting: experience or skills missing.", {
//       description: (
//         <Link
//           text="Add."
//           endIcon={<LiaExternalLinkAltSolid />}
//           to="/settings/my-info"
//           className="flex-y clr-blue"
//           onClick={() => toast.dismiss(id)}
//         />
//       ),
//       duration: 20000,
//     });

//     return;
//   }

//   const missingInfo = getMissingInfo(user);

//   if (missingInfo.length > 0) {
//     const id = toast.info(
//       `Missing: ${missingInfo.join(", ")}. The CV will be partially empty.`,
//       {
//         description: (
//           <Link
//             text="Add them here."
//             to="/settings/my-info"
//             className="clr-blue"
//             onClick={() => toast.dismiss(id)}
//           />
//         ),
//         duration: 20000,
//       }
//     );
//   }

//   toast.loading(`Generating CV with ${model}`, {
//     duration: Infinity,
//   });

//   generateDraft({ vacancy, user, model })
//     .then((res) => {
//       /**
//        * Dismiss loading toast
//        */
//       toast.dismiss();

//       /**
//        * Save draft to local storage (toast handled in function)
//        */
//       const isSaveSuccessful = setLsGeneratedData(vacancyId, res);

//       if (!isSaveSuccessful) return;

//       /**
//        * Show success toast
//        */
//       toast.success(
//         <div className="flex-y gap-1">
//           🎉 Success.
//           <Link
//             text="View CV"
//             to={`/create/${vacancyId}`}
//             className="flex-y gap-1 clr-blue"
//             onClick={() => toast.dismiss("success")}
//           />
//         </div>,
//         {
//           duration: Infinity,
//           dismissible: true,
//           id: "success",
//         }
//       );
//     })
//     .catch((e) => {
//       toast.dismiss();
//       toast.error(`${e}`);
//     });
// };
