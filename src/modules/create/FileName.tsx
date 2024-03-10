import { useEffect, useState } from "react";
import { startCase } from "lodash-es";

import type { PartialVacancy, RouterUser } from "../types";
import { api } from "~/utils";
import { Settings } from "~/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/external/Popover";
import { Switch } from "~/components/ui/external/Switch";
import { typedEntries } from "../utils";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/components/ui/external/RadioGroup";
import {
  FileNameConfig,
  fileNameSeparators,
  getSettings,
  updateSettings,
} from "~/modules/settings/settings";
import { Badge } from "~/components/ui/external/Badge";
import { Spinner } from "~/components";
import { CvContextManager } from "../CvContextManager";
import { SettingsAccessor } from "~/components/SettingsAccessor";

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
  const { data: user } = api.users.get.useQuery();

  const handler = () => {
    const instance = CvContextManager.getInstance();
    const vacancy = instance.getVacancy();

    if (!user || !vacancy) return;

    const settings = getSettings();

    const newFileName = createFileName({
      ...settings.fileNameConfig,
      user,
      vacancy,
    });
    setFileName(newFileName);
    instance.updateCv({ fileName: newFileName });
  };

  useEffect(handler, [user]);

  const handleSwitchChange = (key: keyof FileNameConfig) => {
    updateSettings((prev) => ({
      ...prev,
      fileNameConfig: {
        ...prev.fileNameConfig,
        [key]: !prev.fileNameConfig[key],
      },
    }));
    handler();
  };

  const handleSeparatorChange = (separator: FileNameConfig["separator"]) => {
    updateSettings((prev) => ({
      ...prev,
      fileNameConfig: {
        ...prev.fileNameConfig,
        separator,
      },
    }));
    handler();
  };

  return (
    <div className="flex-center min-w-[750px]">
      <label className="flex-y grow gap-4 whitespace-nowrap">
        File name:
        {fileName ? (
          <input
            type="text"
            name="file-name"
            className="outlined border-bottom w-full whitespace-nowrap bg-transparent pb-1 outline-none transition-all focus:border-weiss"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        ) : (
          <Spinner size={10} />
        )}
      </label>
      <Popover>
        <PopoverTrigger className="hover:main-hover ml-2 rounded-md fill-white p-2">
          <Settings fontSize={30} />
        </PopoverTrigger>
        <PopoverContent className="z-modal">
          <h3 className="text-md tracking-normal">Configure file name</h3>
          <p>Include in the file name</p>
          <section className="my-4 flex flex-col gap-3">
            <SettingsAccessor>
              {({ settings }) =>
                typedEntries(settings.fileNameConfig).map(
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
                )
              }
            </SettingsAccessor>
            <h3 className="mt-5 text-md tracking-normal">Separator</h3>
            <span className="clr-ghost">
              Symbol separating words in the file name
            </span>
            <SettingsAccessor>
              {({ settings }) => (
                <RadioGroup
                  defaultValue={settings.fileNameConfig.separator}
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
              )}
            </SettingsAccessor>
          </section>
        </PopoverContent>
      </Popover>
    </div>
  );
};
