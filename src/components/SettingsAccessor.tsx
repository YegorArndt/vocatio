import { useCallback, useState, type ReactNode } from "react";
import {
  VocatioSettings,
  getSettings,
  updateSettings,
} from "~/modules/settings/settings";

type ChildrenProps = {
  settings: VocatioSettings;
  updater: (cb: (d: VocatioSettings) => VocatioSettings) => void;
};

type SettingsAccessorProps = {
  fallback?: ReactNode;
  children: (props: ChildrenProps) => ReactNode;
};

const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

export const SettingsAccessor = (props: SettingsAccessorProps) => {
  const { fallback, children } = props;
  const forceUpdate = useForceUpdate();

  const updater = (cb: (d: VocatioSettings) => VocatioSettings) => {
    updateSettings((prev) => cb(prev));
    forceUpdate();
  };

  return typeof window === "undefined"
    ? fallback
    : children({ settings: getSettings(), updater });
};
