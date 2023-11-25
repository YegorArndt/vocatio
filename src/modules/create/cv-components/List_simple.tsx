// import cn from "classnames";

// import { Autoresize, type AutoresizeProps } from "./Autoresize";
// import { ComponentValue } from "~/modules/draft/types/components";
// import { useMemo, useState } from "react";

// export type ListProps = {
//   id?: string;
//   autoresizes?: AutoresizeProps[];
//   className?: string;
//   value?: ComponentValue;
//   liClassName?: string;
// };

// const maxItemsPerContext = 7;

// const defaultItems: AutoresizeProps[] = [
//   { id: "1", value: "Item 1" },
//   { id: "2", value: "Item 2" },
//   { id: "3", value: "Item 3" },
// ];

// const getInitial = (
//   items: ListProps["autoresizes"],
//   value: ComponentValue,
//   id: string
// ) => {
//   const initial: ListProps["autoresizes"] = [];
//   const idPrefix = id.split("-")[0];

//   if (!items?.length) {
//     if (typeof value === "string") {
//       const values = value.split(",");
//       values.forEach((value, index) => {
//         initial.push({
//           id: `${idPrefix}-${index.toString()}`,
//           value: value.trim(),
//         });
//       });

//       return initial;
//     }
//   } else {
//     return items;
//   }

//   return defaultItems;
// };

// export const List = (props: ListProps) => {
//   const { value, autoresizes, className, id, liClassName } = props;
//   const [items, setItems] = useState<AutoresizeProps[]>(
//     getInitial(autoresizes, value, id!)
//   );

//   const itemGroups = useMemo(() => {
//     const groups = [];
//     for (let i = 0; i < items.length; i += maxItemsPerContext) {
//       groups.push(items.slice(i, i + maxItemsPerContext));
//     }
//     return groups;
//   }, [items]);

//   return (
//     <div className={cn("grid grid-cols-2 gap-2", className)}>
//       {itemGroups.map((group) => (
//         <ul className="flex flex-col gap-1">
//           {group.map((item) => (
//             <li className={cn("flex items-center gap-2", liClassName)}>
//               <div>&bull;</div>
//               <Autoresize {...item} />
//             </li>
//           ))}
//         </ul>
//       ))}
//     </div>
//   );
// };
