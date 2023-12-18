// import cn from "classnames";
// import { Children, PropsWithChildren, cloneElement } from "react";

// type ButtonGroupProps = PropsWithChildren<{
//   buttonClassName?: string;
// }>;

// const ButtonGroup = (props: ButtonGroupProps) => {
//   const { children, buttonClassName } = props;

//   return (
//     <div className="flex">
//       {Children.map(children, (child) => {
//         if (!child) return null;
//         return cloneElement(child, {
//           className: cn(child.props.className, buttonClassName),
//           ...child.props,
//         });
//       })}
//     </div>
//   );
// };

// export default ButtonGroup;
