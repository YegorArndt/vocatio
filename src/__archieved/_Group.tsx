// import { type CSSProperties, useState } from "react";
// import cn from "classnames";
// import {
//   FocusableItem,
//   Menu,
//   MenuButton,
//   MenuHeader,
//   MenuItem,
// } from "@szhsin/react-menu";

// import { AutoresizeProps } from "~/modules/draft/intrinsic/Autoresize";
// import { typedKeys } from "~/modules/draft/utils/common";
// import { Blur } from "~/components/Blur";
// import { ImageProps } from "next/image";
// import { rest, startCase } from "lodash-es";
// import { useDraftContext } from "~/modules/draft/DraftContext";
// import { useComponentContext } from "../components/ComponentContext";
// import { icons } from "~/constants";

// export type GroupProps = {
//   id: string;
//   label: string;
//   value: string;
//   image: string;
//   smallText?: string | null;
//   smallTextClassName?: string;
//   labelProps?: AutoresizeProps;
//   valueProps?: AutoresizeProps;
//   description?: string;
//   className?: string;
//   style?: CSSProperties;
//   imageProps?: Partial<ImageProps>;
// };

// type IconProps = {
//   image: string;
//   imageProps: Partial<ImageProps> | undefined;
// };

// const BlurIcon = (props: ImageProps) => {
//   const { src, height = 20, width = 20, alt, className } = props;
//   const Icon = icons[src as keyof typeof icons];

//   const pps = { height, width, alt, className };

//   const icon = Icon ? <Icon {...pps} /> : <img {...pps} src={src as string} />;

//   return <Blur element={icon} />;
// };

// const Icon = (props: IconProps) => {
//   const { image, imageProps } = props;
//   const [filter, setFilter] = useState("");

//   const c = useComponentContext();
//   const { updateDesign } = useDraftContext();

//   const onImageChange = (key: keyof typeof icons) => {
//     const newProps = { ...c.props, image: key };
//     c.props = newProps;
//     updateDesign();
//   };

//   return (
//     <Menu
//       menuButton={
//         <MenuButton>
//           <BlurIcon src={image} {...(imageProps as { alt: string })} />
//         </MenuButton>
//       }
//       direction="left"
//       gap={25}
//       transition
//       portal
//     >
//       <MenuHeader>Change to</MenuHeader>
//       <FocusableItem className="mb-2">
//         {({ ref }) => (
//           <input
//             ref={ref}
//             type="text"
//             placeholder="Type to filter"
//             value={filter}
//             className={cn(
//               "border-gray-300 focus:border-gray-500 w-full border-b bg-transparent p-2 focus:outline-none"
//             )}
//             onChange={(e) => setFilter(e.target.value)}
//           />
//         )}
//       </FocusableItem>
//       {typedKeys(icons)
//         .filter((iconKey) =>
//           iconKey.toUpperCase().includes(filter.trim().toUpperCase())
//         )
//         .map((i) => (
//           <MenuItem
//             key={i}
//             className="flex items-center gap-4 first-letter:capitalize hover:bg-transparent"
//             onClick={() => onImageChange(i)}
//           >
//             <BlurIcon {...rest} {...(imageProps as { alt: string })} src={i} />
//             {startCase(i)}
//           </MenuItem>
//         ))}
//     </Menu>
//   );
// };

// export const Group = (props: GroupProps) => {
//   const { value } = useComponentContext();

//   return (
//     <div>{value}</div>
//     // <div
//     //   className={cn(className, {
//     //     "!block": c.type === "text",
//     //   })}
//     //   {...rest}
//     // >
//     //   {c.type === "icon-group" && (
//     //     <Icon image={image} imageProps={imageProps} />
//     //   )}

//     //   {c.type === "group" && (
//     //     <Autoresize type="label" value={label} {...labelProps} />
//     //   )}

//     //   {smallText ? (
//     //     <div className="flex flex-col">
//     //       <Autoresize value={value} {...valueProps} />
//     //       <small className={smallTextClassName}>
//     //         <Autoresize type="smallText" value={smallText} />
//     //       </small>
//     //     </div>
//     //   ) : (
//     //     <Autoresize value={value} {...valueProps} />
//     //   )}
//     // </div>
//   );
// };
