import { BsLayoutWtf } from "react-icons/bs";
import { TbAdjustments } from "react-icons/tb";
import { NavigationLink } from "~/components";

export const preferencesToolbar = [
  // {
  //   text: "Adjust completely",
  //   to: "/adjust-completely",
  //   frontIcon: <VscCircleLargeFilled />,
  // },
  // {
  //   text: "Adjust slightly",
  //   to: "/adjust-slightly",
  //   frontIcon: <FaAdjust />,
  // },
  { text: "Me", to: "/preferences/me", frontIcon: <BsLayoutWtf /> },
  {
    text: "Customize autocomplete",
    to: "/preferences/autocomplete",
    frontIcon: <TbAdjustments />,
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover flex-y gap-1"
    activeCn="bg-hover"
    {...props}
  />
));
