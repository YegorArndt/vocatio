import { startCase } from "lodash-es";
import { Settings } from "~/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/external/Popover";
import { Switch } from "~/components/ui/external/Switch";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { useLs } from "~/hooks/useLs";
import { typedEntries } from "../utils";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/components/ui/external/RadioGroup";
import { FileNameConfig, fileNameSeparators } from "~/utils/ls";
import { PartialVacancy, RouterUser } from "../types";
import { Badge } from "~/components/ui/external/Badge";
import { useEffect, useState } from "react";

const { log } = console;

type FileNameProps = FileNameConfig & {
  vacancy: PartialVacancy;
  user: RouterUser;
};

export const createFileName = (props: FileNameProps) => {
  const {
    myName,
    myJobTitle,
    vacancyJobTitle,
    companyName,
    date,
    separator,
    vacancy,
    user,
  } = props;

  const parts: string[] = [];

  const formatPart = (part: string) => part.replace(/\s+/g, separator);

  if (myName && user.name) {
    parts.push(formatPart(user.name));
  }
  if (myJobTitle && user.jobTitle) {
    parts.push(formatPart(user.jobTitle));
  }
  if (vacancyJobTitle && vacancy.jobTitle) {
    parts.push(formatPart(vacancy.jobTitle));
  }
  if (companyName && vacancy.companyName) {
    parts.push(formatPart(vacancy.companyName));
  }
  if (date) {
    parts.push(new Date().toISOString().slice(0, 10).replace(/-/g, separator)); // Format: YYYY-MM-DD with separator
  }

  return parts.join(separator);
};

export const FileName = () => {
  const [fileName, setFileName] = useState("");

  const { generated, updateGeneratedData } = useGeneratedData();
  const { ls, updateLs } = useLs();

  useEffect(() => {
    if (generated && !fileName) {
      setFileName(generated.fileName);
    }
  }, [generated]);

  useEffect(() => {
    if (generated) {
      const newFileName = createFileName({
        ...ls.fileNameConfig,
        user: generated,
        vacancy: generated.vacancy,
      });

      setFileName(newFileName);
      updateGeneratedData({ ...generated, fileName: newFileName });
    }
  }, [generated, ls.fileNameConfig, updateLs]);

  const handleSwitchChange = (key: keyof FileNameConfig) => {
    updateLs({
      fileNameConfig: {
        ...ls.fileNameConfig,
        [key]: !ls.fileNameConfig[key],
      },
    });
  };

  const handleSeparatorChange = (separator: FileNameConfig["separator"]) => {
    updateLs({
      fileNameConfig: {
        ...ls.fileNameConfig,
        separator,
      },
    });
  };

  return (
    <header className="flex-center h-20 w-full bg-primary">
      <label className="flex-y grow gap-4 whitespace-nowrap">
        File name:
        {generated && (
          <input
            type="text"
            name="file-name"
            className="outlined border-bottom w-full whitespace-nowrap bg-transparent pb-1 outline-none transition-all focus:border-weiss"
            value={generated.fileName}
          />
        )}
      </label>
      <Popover>
        <PopoverTrigger className="hover:main-hover ml-2 rounded-md fill-white p-2">
          <Settings fontSize={30} />
        </PopoverTrigger>
        <PopoverContent>
          <h3 className="text-md tracking-normal">Configure file name</h3>
          <p>Include in the file name</p>
          <section className="my-4 flex flex-col gap-3">
            {typedEntries(ls.fileNameConfig).map(
              ([k, v]) =>
                k !== "separator" && (
                  <label key={k} className="flex-y gap-2">
                    <Switch
                      checked={v as boolean}
                      onClick={() =>
                        handleSwitchChange(k as keyof FileNameConfig)
                      }
                    />
                    {startCase(k)}
                  </label>
                )
            )}
            <h3 className="mt-5 text-md tracking-normal">Separator</h3>
            <span className="clr-ghost">
              Symbol separating words in the file name
            </span>
            <RadioGroup
              defaultValue={ls.fileNameConfig.separator}
              onValueChange={handleSeparatorChange}
            >
              {fileNameSeparators.map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <RadioGroupItem value={s} id={s} />
                  <label htmlFor={s}>
                    {s === " " ? (
                      <div className="flex-y gap-2">
                        Space <Badge>not recommended</Badge>
                      </div>
                    ) : (
                      s
                    )}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </section>
        </PopoverContent>
      </Popover>
    </header>
  );
};
