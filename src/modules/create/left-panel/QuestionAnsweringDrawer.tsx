// import {
//   DrawerContent,
//   Drawer,
//   DrawerHandle,
//   DrawerTrigger,
// } from "~/components/ui/external/Drawer";
// import { NAV_BUTTON_CN } from "./constants";
// import { SiAnswer } from "react-icons/si";
// import { cn } from "~/utils";
// import { FormContext } from "~/modules/preferences/my-info/FormContext";
// import { Textarea } from "~/components/ui/inputs/Textarea";
// import { Button } from "~/components/ui/buttons/Button";
// import { useState } from "react";
// import { Gpt } from "~/components/icons";

// const { log } = console;

// export const QuestionAnsweringDrawer = () => {
//   const [answersDisabled, setAnswersDisabled] = useState(true);

//   return (
//     <Drawer>
//       <DrawerTrigger className={cn(NAV_BUTTON_CN, "gap-2")}>
//         <SiAnswer /> Question answering with AI
//       </DrawerTrigger>
//       <DrawerContent className="min-h-[80vh] bg-primary px-10 py-5">
//         <DrawerHandle />
//         <h3 className="flex-y gap-2">
//           <SiAnswer />
//           Question answering
//         </h3>
//         <p>
//           Companies frequently ask many questions while you simply want to get
//           it over with the application. This section helps speed up the process
//           by bringing in the AI.
//         </p>
//         <FormContext
//           form={{
//             defaultValues: { questions: "", answers: "" },
//           }}
//         >
//           {({ control, formState }) => (
//             <form className="grid grow grid-cols-2 gap-8">
//               <label className="flex flex-col gap-3">
//                 <section className="flex flex-col gap-1">
//                   <h4>Questions</h4>
//                   <p>
//                     Just copy-paste. The AI already knows the context of your
//                     application.
//                   </p>
//                 </section>
//                 <Textarea
//                   control={control}
//                   name="questions"
//                   textareaClassName="grow h-full"
//                   className="grow"
//                 />
//               </label>
//               <label className="flex flex-col gap-3">
//                 <section className="flex flex-col gap-1">
//                   <h4>Answers</h4>
//                   <p>Takes up to 15 seconds.</p>
//                 </section>
//                 <Textarea
//                   control={control}
//                   name="questions"
//                   textareaClassName="grow h-full"
//                   className={cn("grow", {
//                     "opacity-30": answersDisabled,
//                   })}
//                   disabled={answersDisabled}
//                 />
//               </label>
//               <footer className="flex-center col-span-2">
//                 <Button
//                   frontIcon={<Gpt />}
//                   text="Ask AI"
//                   className="primary sm flex-y"
//                   disabled={!formState.isDirty}
//                 />
//               </footer>
//             </form>
//           )}
//         </FormContext>
//       </DrawerContent>
//     </Drawer>
//   );
// };
