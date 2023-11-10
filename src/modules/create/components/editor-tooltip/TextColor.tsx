// const ColorCube = (props: { color: string }) => {
//     const { color } = props;

//     return (
//       <div
//         className="mr-2 h-[15px] w-[15px] rounded-sm border"
//         style={{ backgroundColor: color }}
//       />
//     );
//   };

// export const TextColor = () => {

//     return  <Menu
//     menuButton={
//       <MenuButton className="navigation sm common gap-2">
//         Text Color
//         <BiChevronDown />
//       </MenuButton>
//     }
//   >
//     {"black white blue".split(" ").map((color) => (
//       <MenuItem
//         key={color}
//         onClick={() => {
//           updateDesign((design) => {
//             return updateCn(
//               design,
//               id,
//               `clr-${color}`,
//               /clr-.*$/
//             );
//           });
//         }}
//       >
//         <ColorCube color={color} />
//         {color}
//       </MenuItem>
//     ))}
//   </Menu>
// }
