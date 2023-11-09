import { IT_COMPANY_NAMES } from "./constants";

export const getRandomCompanyName = () => {
  const randomIndex = Math.floor(Math.random() * IT_COMPANY_NAMES.length);
  return IT_COMPANY_NAMES[randomIndex];
};
