// import { AiOutlineUnderline } from "react-icons/ai";
// import { BsTypeItalic } from "react-icons/bs";
// import { ImBold } from "react-icons/im";
// import { Button } from "~/components/ui/buttons/Button";
// import { Design } from "~/modules/draft/types";
// import { updateCn } from "./utils";

// const quickActions = {
//   bold: {
//     content: <ImBold />,
//     updateFn: (design: Design, componentId: string) =>
//       updateCn(design, componentId, "font-bold"),
//   },
//   "border-bottom": {
//     content: <AiOutlineUnderline />,
//     updateFn: (design: Design, componentId: string) =>
//       updateCn(design, componentId, "border-bottom"),
//   },
//   italic: {
//     content: <BsTypeItalic />,
//     updateFn: (design: Design, componentId: string) =>
//       updateCn(design, componentId, "!italic"),
//   },
// };

// export const QuickActions = () => {
//   return (
//     <>
//       {Object.entries(quickActions).map(([key, { content, updateFn }]) => (
//         <li key={key}>
//           <Button
//             baseCn="navigation sm gap-2"
//             className={cn({
//               "!clr-secondary-hover scale-110 transform !bg-secondary-hover transition":
//                 component.props.className?.includes(key),
//             })}
//             onClick={() => {
//               updateDesign((design) => updateFn(design, id));
//             }}
//           >
//             {content}
//           </Button>
//         </li>
//       ))}
//     </>
//   );
// };
