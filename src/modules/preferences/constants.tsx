import { NavigationLink } from "~/components";
import { GoDatabase } from "react-icons/go";
import { startCase } from "lodash-es";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/external/Tooltip";
import { Gpt } from "~/icons";

export const preferencesToolbar = [
  <NavigationLink
    key="My data"
    frontIcon={<GoDatabase />}
    text="My info"
    to="/preferences"
    baseCn="common hover flex-y gap-1"
    activeCn="bg-hover"
  />,
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        className="common hover flex-y gap-3 whitespace-nowrap"
        disabled
      >
        <Gpt /> AI fine-tuning
      </TooltipTrigger>
      <TooltipContent>✨ Coming soon</TooltipContent>
    </Tooltip>
  </TooltipProvider>,
];

export const languages = [
  "chinese",
  "spanish",
  "english",
  "hindi",
  "bengali",
  "portuguese",
  "russian",
  "japanese",
  "punjabi",
  "marathi",
  "telugu",
  "wu chinese",
  "turkish",
  "korean",
  "french",
  "german",
  "vietnamese",
  "tamil",
  "urdu",
  "javanese",
  "italian",
  "egyptian arabic",
  "gujarati",
  "iranian persian",
  "bhojpuri",
  "southern min",
  "hakka",
  "jin chinese",
  "hausa",
  "kannada",
  "indonesian",
  "polish",
  "yoruba",
  "xiang chinese",
  "malayalam",
  "odia",
  "maithili",
  "burmese",
  "eastern punjabi",
  "sunda",
  "sudanese arabic",
  "algerian arabic",
  "moroccan arabic",
  "ukrainian",
  "igbo",
  "northern uzbek",
  "sindhi",
  "north levantine arabic",
  "romanian",
  "tagalog",
  "dutch",
  "sa'idi arabic",
  "gan chinese",
  "amharic",
  "northern pashto",
];

export const languageLabelsOptions = languages.map((l) => ({
  label: startCase(l),
  value: startCase(l),
}));
export const languageValuesOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Basic", value: "BASIC" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "Expert", value: "EXPERT" },
  { label: "Native", value: "NATIVE" },
];
export const languageValuesOptionsCefr = [
  { label: "A1", value: "BEGINNER" },
  { label: "A2", value: "BASIC" },
  { label: "A2", value: "INTERMEDIATE" },
  { label: "B1", value: "ADVANCED" },
  { label: "B2", value: "EXPERT" },
  { label: "Native", value: "NATIVE" },
];
