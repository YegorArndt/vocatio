import Image from "next/image";

type UserPresentatorProps = {
  src: string;
  name: string;
};

export const UserPresentator = (props: UserPresentatorProps) => {
  const { src, name } = props;

  return (
    <div className="flex w-full items-center justify-normal gap-4 pl-3 pt-5">
      {/* <Logo /> */}
      <span>Welcome to Careerpilot Beta 😉</span>
      <div className="h-[30px] w-[0.5px] rotate-[30deg] transform bg-base-reversed" />
      <Image
        src={src}
        height={25}
        width={25}
        className="rounded-full"
        alt={name || "Welcome!"}
      />
      <span>{name || "Loading..."}</span>
    </div>
  );
};
