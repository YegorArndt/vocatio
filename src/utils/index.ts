import cn from "classnames";
import { toast } from "sonner";

export { cn };

export { api } from "./api";

export const somethingWentWrong = () =>
  toast.error("Something went wrong. Please try again.");
