// import { useState, Fragment } from "react";
// import { BsArrowsCollapse } from "react-icons/bs";
// import { FaTextHeight } from "react-icons/fa";
// import { RiFontSansSerif } from "react-icons/ri";
// import { FaClockRotateLeft } from "react-icons/fa6";

// import { useDraftContext } from "../../../__archieved/draft/DraftContext";
// import { Button } from "~/components/ui/buttons/Button";
// import { FocusableItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
// import {
//   TooltipTrigger,
//   TooltipContent,
//   Tooltip,
//   TooltipProvider,
// } from "~/components/ui/external/Tooltip";
// import { CustomMenu } from "~/components/ui/external/CustomMenu";
// import { CustomMenuItem } from "~/components/ui/external/CustomMenuItem";
// import { toast } from "sonner";
// import { usePersistentData } from "~/hooks/usePersistentData";
// import { downloadPdf } from "./utils";
// import { SlMagnifier } from "react-icons/sl";
// import { BlurImage } from "~/components";
// import { Blur } from "~/components/Blur";
// import {
//   DrawerTrigger,
//   Drawer,
//   DrawerContent,
//   DrawerHandle,
// } from "~/components/ui/external/Drawer";
// import { Diff } from "./Diff";
// import { CoverLetterDrawer } from "../cover-letter/CoverLetterDrawer";
// import { cvFonts } from "./constants";
// import { MoveToAppliedButton } from "./MoveToAppliedButton";
// import { LinkedinColor } from "~/components/icons";
// import { Link } from "~/components/ui/buttons/Link";

// const { log } = console;

// export const Toolbar = () => {
//   const { draft, a4Ref, design, updateDesign } = useDraftContext();
//   const { ls } = usePersistentData();
//   const [filter, setFilter] = useState("");

//   return (
//     <Fragment>
//       <Link
//         frontIcon={<LinkedinColor />}
//         text="View source"
//         to={draft.vacancy.sourceUrl}
//         newTab
//         className="common hover flex-y gap-2"
//       />
//       <Drawer>
//         <DrawerTrigger
//           className="common hover flex-y gap-3"
//           suppressHydrationWarning
//         >
//           <Blur element={<SlMagnifier />} />
//           Review changes
//         </DrawerTrigger>
//         <DrawerContent className="max-h-[90vh] bg-primary py-5 pl-5">
//           <DrawerHandle />
//           {ls.user && <Diff user={ls.user} vacancy={draft.vacancy} />}
//         </DrawerContent>
//       </Drawer>
//       <CoverLetterDrawer />
//       <Button
//         text="Download PDF"
//         suppressHydrationWarning
//         frontIcon={
//           <BlurImage
//             src="/download-cloud.png"
//             alt="Download"
//             height={15}
//             width={15}
//           />
//         }
//         onClick={() => {
//           void downloadPdf({
//             a4Ref,
//             user: ls.user!,
//             draft,
//           });

//           const message = ls.shouldAutoMoveToApplied ? (
//             "Downloaded PDF and moved to ✅ applied"
//           ) : (
//             <MoveToAppliedButton vacancyId={draft.vacancy.id} />
//           );

//           toast.success(message, {
//             id: "move-to-applied",
//             duration: ls.shouldAutoMoveToApplied ? undefined : 30000,
//           });
//         }}
//         className="common hover flex-y gap-1"
//       />
//       <CustomMenu
//         menuButton={
//           <MenuButton className="common hover flex-y  gap-3">
//             <RiFontSansSerif /> {design.font}
//           </MenuButton>
//         }
//         direction="right"
//         transition
//       >
//         <FocusableItem>
//           {({ ref }) => (
//             <input
//               ref={ref}
//               type="text"
//               placeholder="Search fonts"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="bg-transparent p-2 outline-none"
//             />
//           )}
//         </FocusableItem>
//         <MenuDivider />
//         {cvFonts
//           .filter((font) => font.toLowerCase().includes(filter.toLowerCase()))
//           .map((font) => (
//             <CustomMenuItem
//               key={font}
//               onClick={() =>
//                 updateDesign({ font: font === "Inter" ? "inherit" : font })
//               }
//             >
//               {font}
//             </CustomMenuItem>
//           ))}
//       </CustomMenu>
//       {[
//         { text: "Undo", icon: <FaClockRotateLeft /> },
//         { text: "Condense spacing", icon: <BsArrowsCollapse /> },
//         { text: "Condense text", icon: <FaTextHeight /> },
//       ].map(({ text, icon }) => (
//         <TooltipProvider key={text}>
//           <Tooltip>
//             <TooltipTrigger
//               className="common hover flex-y gap-3 whitespace-nowrap"
//               disabled
//             >
//               {icon} {text}
//             </TooltipTrigger>
//             <TooltipContent>✨ Coming soon</TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       ))}
//     </Fragment>
//   );
// };
