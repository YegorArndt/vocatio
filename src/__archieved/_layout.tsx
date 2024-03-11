// import { type ReactNode, type PropsWithChildren } from "react";

// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "../ui/external/Resizable";
// import { useUser, SignOutButton } from "@clerk/nextjs";
// import { MenuButton, Menu } from "@szhsin/react-menu";
// import { useRouter } from "next/router";
// import { PiSignOutDuotone } from "react-icons/pi";
// import { api, cn } from "~/utils";
// import { Divider } from "./Divider";
// import Image from "next/image";
// import { IoSettingsOutline } from "react-icons/io5";
// import { MdDashboardCustomize } from "react-icons/md";
// import { NavigationLink } from "../NavigationLink";
// import { getSettings } from "~/modules/settings/settings";

// const { log } = console;

// type LayoutProps = PropsWithChildren<{
//   className?: string;
//   toolbar?: ReactNode;
// }>;

// const NAVBAR_WIDTH = 155;
// const NAVBAR_SELECTOR = `@[${NAVBAR_WIDTH}px]`;

// export const NAVBAR_LINK = `!justify-normal primary px-4 py-2 indent-[-9999px] ${NAVBAR_SELECTOR}:min-w-full ${NAVBAR_SELECTOR}:gap-[9px] ${NAVBAR_SELECTOR}:py-1 ${NAVBAR_SELECTOR}:indent-0`;
// export const NAVBAR_ICON = `transition-all ease-in-out ${NAVBAR_SELECTOR}:h-[15px] ${NAVBAR_SELECTOR}:w-[15px]`;

// export const Navbar = (props: PropsWithChildren<Record<string, unknown>>) => {
//   const { children } = props;
//   const { user: clerkUser } = useUser();
//   const { data: user } = api.users.get.useQuery();
//   const router = useRouter();

//   const name = clerkUser?.firstName || user?.name;
//   const veryTop = name ? `${name}'s` : "Your";

//   return (
//     <ResizablePanel
//       minSize={4}
//       defaultSize={15}
//       className="z-layout h-screen bg-secondary clr-secondary @container"
//       tagName="nav"
//     >
//       <div
//         className={`flex-center flex-wrap gap-2 p-2 font-medium ${NAVBAR_SELECTOR}:block ${NAVBAR_SELECTOR}:p-0`}
//       >
//         <Menu
//           menuButton={
//             <MenuButton
//               className={cn(
//                 "flex-y navbar-link whitespace-nowrap !py-3 clr-primary",
//                 NAVBAR_LINK
//               )}
//             >
//               <Image src="/favicon.ico" alt="" height={15} width={15} />
//               <span className={`hidden ${NAVBAR_SELECTOR}:block`}>
//                 {veryTop} vocatio
//               </span>
//             </MenuButton>
//           }
//           transition
//           className="[&>*]:p-3"
//           portal
//         >
//           <SignOutButton signOutCallback={() => router.push("/landing")}>
//             <span className="flex-y cursor-pointer gap-2">
//               <PiSignOutDuotone /> Sign out
//             </span>
//           </SignOutButton>
//         </Menu>
//         {[
//           {
//             text: "My vacancies",
//             to: "/vacancies",
//             frontIcon: (
//               <MdDashboardCustomize className={NAVBAR_ICON} fontSize={18} />
//             ),
//           },
//           {
//             text: "Settings",
//             to: "/settings/me",
//             frontIcon: (
//               <IoSettingsOutline className={NAVBAR_ICON} fontSize={18} />
//             ),
//             activeIfIncludes: ["updateKey", "settings"],
//           },
//         ].map(({ text, frontIcon, to, activeIfIncludes }) => (
//           <NavigationLink
//             key={text}
//             to={to}
//             activeIfIncludes={activeIfIncludes}
//             baseCn="primary"
//             activeCn="main-hover"
//             className={NAVBAR_LINK}
//           >
//             {frontIcon}
//             {text}
//           </NavigationLink>
//         ))}
//         <Divider className={`hidden ${NAVBAR_SELECTOR}:block`} />
//         {children}
//       </div>
//     </ResizablePanel>
//   );
// };

// export const Layout = (props: LayoutProps) => {
//   const { children, toolbar } = props;

//   const onLoad = () => {
//     const settings = getSettings();
//     const { navbarWidth } = settings;
//   };

//   return (
//     <ResizablePanelGroup direction="horizontal" onLoad={log}>
//       <Navbar>{toolbar}</Navbar>

//       <ResizableHandle
//         title="Drag to resize the sidebar"
//         className="w-[100px] !cursor-col-resize transition-all ease-in-out hover:bg-weiss"
//       />

//       <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
//     </ResizablePanelGroup>
//   );
// };
