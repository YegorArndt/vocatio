// import { api } from "~/utils";
// import { useDraftContext } from "../../../../__archieved/draft/DraftContext";
// import { useComponentContext } from "../contexts/ComponentContext";
// import { ClickEvent } from "@szhsin/react-menu";
// import { useForm } from "react-hook-form";

// export const useAiMethods = () => {
//   const { updateDesign } = useDraftContext();
//   const c = useComponentContext();

//   const { control, watch } = useForm();

//   const onSuccess = (value: string) => {
//     const newProps = { ...c.props, value };
//     c.props = newProps;
//     updateDesign();
//   };

//   const { mutate: applyCondensation } = api.hf.condense.useMutation({
//     onSuccess,
//   });

//   const { mutate: applyElaboration } = api.hf.elaborate.useMutation({
//     onSuccess: (elaborated) => {
//       const newProps = { ...c.props, value: `${c.props.value} ${elaborated}` };
//       c.props = newProps;
//       updateDesign();
//     },
//   });

//   const { mutate: applyConversion } = api.hf.convert.useMutation({
//     onSuccess,
//   });

//   const { mutate: applyCustom } = api.hf.custom.useMutation({
//     onSuccess,
//   });

//   /**
//    * Compose TS methods.
//    */
//   const condense = () => {
//     const text = c.props.value;
//     if (!text) return;

//     applyCondensation({ text });
//   };

//   const elaborate = () => {
//     const text = c.props.value;
//     if (!text) return;

//     applyElaboration({ text });
//   };

//   const convert = (target: "bulletPoints" | "text") => {
//     const text = c.props.value;
//     if (!text) return;

//     applyConversion({ text, target });
//   };

//   const adjust = () => {
//     const text = c.props.value;

//     const userCommand = watch("custom") as string;
//     if (!text || !userCommand) return;

//     const adjustWhat = c.id.includes("description")
//       ? "employment history"
//       : "professional summary";

//     applyCustom({
//       text,

//       userCommand,
//     });
//   };

//   const custom = async (e: ClickEvent) => {
//     const inputValue = watch("custom");
//     const text = c.props.value;

//     if (!text || !inputValue) return;

//     applyCustom({
//       text: c.props.value!,
//       userCommand: inputValue,
//     });
//   };

//   return {
//     control,
//     watch,
//     condense,
//     elaborate,
//     convert,
//     adjust,
//     custom,
//   };
// };
