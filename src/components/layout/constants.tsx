import { IoSettingsOutline } from "react-icons/io5";
import { TfiLayoutGrid4 } from "react-icons/tfi";
import { NavigationLink } from "../NavigationLink";

export const mainNav = [
  { text: "My vacancies", to: "/vacancies", frontIcon: <TfiLayoutGrid4 /> },
  {
    text: "Preferences",
    to: "/preferences/my-info",
    frontIcon: <IoSettingsOutline />,
    activeIfIncludes: ["customize-ai", "updateKey"],
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover flex-y gap-2"
    activeCn="bg-hover"
    {...props}
  />
));
