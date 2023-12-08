import { PropsWithChildren } from "react";

export const Wrapper = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <section className="flex flex-col gap-8 rounded-md border bg-card pt-6 [&>*]:px-6">
      {children}
    </section>
  );
};
