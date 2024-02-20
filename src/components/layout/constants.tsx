import { IoSettingsOutline } from "react-icons/io5";
import { TfiLayoutGrid4 } from "react-icons/tfi";
import { NavigationLink } from "../NavigationLink";

export const mainNav = [
  { text: "My vacancies", to: "/vacancies", frontIcon: <TfiLayoutGrid4 /> },
  {
    text: "Settings",
    to: "/settings/me",
    frontIcon: <IoSettingsOutline />,
    activeIfIncludes: ["customize-ai", "updateKey", "settings"],
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover flex-y gap-2"
    activeCn="bg-hover"
    {...props}
  />
));
