import {
  FaClock,
  FaDollarSign,
  FaGlobe,
  FaLinkedin,
  FaUsers,
} from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { GiSunglasses } from "react-icons/gi";
import { BsPersonWorkspace } from "react-icons/bs";
import { GiOfficeChair } from "react-icons/gi";
import { FaUniversity } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import { MdWorkOutline } from "react-icons/md";

export const vacancyUI = {
  salary: {
    text: "Salary",
    icon: <FaDollarSign />,
  },
  country: {
    text: "Country",
    icon: <FaGlobe />,
  },
  salaryCurrency: {
    text: "Currency",
    icon: <FaDollarSign />,
  },
  numApplicants: {
    text: "Applicants",
    icon: <FaUsers />,
  },
  location: {
    text: "Location",
    icon: <IoLocationOutline />,
  },
  employmentType: {
    text: "Employment type",
    icon: <MdWorkOutline />,
  },
  age: {
    text: "Age",
    icon: <FaClock />,
  },
  LINKEDIN: {
    text: "LinkedIn",
    icon: <FaLinkedin />,
  },
  requiredEducation: {
    text: "Required education",
    icon: <FaUniversity />,
  },
  requiredLanguages: {
    text: "Required languages",
    icon: <HiLanguage />,
  },
  requiredRemote: {
    text: "Required format (remote or office)",
    icon: <GiOfficeChair />,
  },
  requiredSeniority: {
    text: "Required seniority",
    icon: <GiSunglasses />,
  },
  requiredSkills: {
    text: "Required skills",
    icon: <GiSunglasses />,
  },
  requiredYears: {
    text: "Required experience",
    icon: <BsPersonWorkspace />,
  },
};

export const defaultGroups = {
  favorite: {
    icon: <span>😻</span>,
    label: "Favorite",
  },
  applied: {
    icon: <span>✅</span>,
    label: "Applied",
  },
  interview: {
    icon: <span>🎥</span>,
    label: "Interview",
  },
  rejected: {
    icon: <span>😿</span>,
    label: "Rejected",
  },
  offer: {
    icon: <span>🎉</span>,
    label: "Offer",
  },
};
