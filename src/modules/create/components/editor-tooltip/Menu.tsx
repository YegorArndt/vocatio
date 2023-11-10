// import { MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu";
// import { FaUndo, FaHeading } from "react-icons/fa";
// import { Button } from "~/components/ui/buttons/Button";
// import { updateType } from "./utils";
// import { AiFillDelete, AiOutlineCopy } from "react-icons/ai";

// const menuActions = [
//   {
//     label: "Delete",
//     icon: <AiFillDelete />,
//   },
//   {
//     label: "Duplicate",
//     icon: <AiOutlineCopy />,
//   },
// ];

// export const Menu = () => {
//   return (
//     <Menu
//       menuButton={
//         <MenuButton className="navigation sm common gap-2">
//           <BiDotsHorizontalRounded />
//         </MenuButton>
//       }
//     >
//       {menuActions.map(({ label, icon }) => (
//         <MenuItem key={label} className="flex items-center gap-2">
//           {icon}
//           {label}
//         </MenuItem>
//       ))}
//       <SubMenu
//         label={
//           <Button className="flex items-center gap-2" disabled>
//             <FaUndo />
//             Turn into
//           </Button>
//         }
//       >
//         {[
//           {
//             content: (
//               <>
//                 <BiText />
//                 Text
//               </>
//             ),
//             onClick: () =>
//               updateDesign((design) => updateType(design, id, "baseText")),
//           },
//           {
//             content: (
//               <>
//                 <FaHeading />
//                 Heading
//               </>
//             ),
//             onClick: () =>
//               updateDesign((design) => updateType(design, id, "baseHeading")),
//           },
//           {
//             content: (
//               <>
//                 <LuUngroup />
//                 Group (label)
//               </>
//             ),
//             onClick: () =>
//               updateDesign((design) => updateType(design, id, "baseGroup")),
//           },
//         ].map(({ content }, index) => (
//           <MenuItem key={index} className="flex items-center gap-2">
//             <Button disabled>{content}</Button>
//           </MenuItem>
//         ))}
//       </SubMenu>
//     </Menu>
//   );
// };
