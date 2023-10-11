import { Logo } from "./Logo";

export const LogoLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Logo className="h-[3rem] w-[3rem] animate-rotate-y-circle" />
    </div>
  );
};
