import { IoCloudUploadOutline } from "react-icons/io5";
import { Badge } from "~/components/ui/external/Badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";

const { log } = console;

export const UploadCvPopover = () => {
  return (
    <Popover>
      <PopoverTrigger className="primary sm w-min gap-2 whitespace-nowrap">
        <IoCloudUploadOutline size={20} />
        Upload an existing CV
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()} side="right">
        <div className="size-full flex flex-col gap-4 overflow-auto">
          <header>
            <b>CV upload</b> <Badge>Available from v. 0.2</Badge>
          </header>
          <div>
            Vocatio will use AI to analyze your CV and generate your profile.
          </div>
          <footer>v. 0.2 is coming in March. Stay tuned!</footer>
        </div>
      </PopoverContent>
    </Popover>
  );
};
