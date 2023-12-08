import { NavigationLink } from "~/components";
import { BiCustomize } from "react-icons/bi";

export const preferencesToolbar = [
  {
    text: "Fine-tune",
    to: "/preferences/fine-tune",
    frontIcon: <span>✨</span>,
  },
  {
    text: "Customize",
    to: "/preferences/customize",
    frontIcon: <BiCustomize />,
  },
].map((props) => (
  <NavigationLink
    key={props.text}
    baseCn="common hover flex-y gap-1"
    activeCn="bg-hover"
    {...props}
  />
));
