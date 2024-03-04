import { IoSettingsOutline } from "react-icons/io5";
import { NavigationLink } from "../NavigationLink";
import { MdDashboardCustomize } from "react-icons/md";

export const mainNav = [
  {
    text: "My vacancies",
    to: "/vacancies",
    frontIcon: <MdDashboardCustomize fontSize={16} />,
  },
  {
    text: "Settings",
    to: "/settings/me",
    frontIcon: <IoSettingsOutline fontSize={16} />,
    activeIfIncludes: ["customize-ai", "updateKey", "settings"],
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover:main-hover flex-y gap-2"
    activeCn="main-hover"
    {...props}
  />
));
