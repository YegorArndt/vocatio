import { User } from "@prisma/client";

export const getFineTuneLink = (linkedinId: string, section: keyof User) => {
  return `https://www.linkedin.com/details/${section}/${linkedinId}`;
};
