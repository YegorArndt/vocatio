import cn from "classnames";
import { PropsWithChildren, type CSSProperties, Fragment } from "react";

import { Divider } from "./layout/Divider";

export type DecoProps = PropsWithChildren<{
  className?: string;
  size?: number;
  style?: CSSProperties;
  length?: number;
}>;

export const Spinner = (props: DecoProps) => {
  const { className, size = 24 } = props;

  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <style jsx global>
        {`
          .lds-ring {
            display: inline-block;
            position: relative;
            width: ${size}px;
            height: ${size}px;
          }
          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            margin: 1px;
            border: 2px solid #fff;
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #fff transparent transparent transparent;
          }
          .lds-ring div:nth-child(1) {
            animation-delay: -0.45s;
          }
          .lds-ring div:nth-child(2) {
            animation-delay: -0.3s;
          }
          .lds-ring div:nth-child(3) {
            animation-delay: -0.15s;
          }
          @keyframes lds-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-md border bg-card [&>*]:p-4">
      <header className="flex-y gap-8 [&>*]:rounded-full">
        <i className="skeleton h-[70px] min-w-[70px]" />
        <i className="skeleton h-5 w-full" />
        <i className="skeleton h-5 w-8" />
      </header>
      <LineStack
        length={3}
        className="ml-1 !gap-0 [&>*:first-child]:max-w-[180px]"
      />
      <LineStack
        length={1}
        className="border-top border-bottom [&>*]:flex-row-reverse [&>*]:justify-between"
      />
      <LineStack className="!flex-row [&>*]:basis-[30%]" />
    </div>
  );
};

export const CardStack = (props: DecoProps) => {
  const { className, length = 6 } = props;

  return (
    <div className={cn("card-grid", className)}>
      {Array.from({ length }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const Line = (props: DecoProps) => {
  const { className } = props;

  return (
    <div className={cn("flex-y h-5 w-full gap-2", className)}>
      <div className="skeleton h-3 w-3 rounded-full" />
      <p className="skeleton h-2 w-1/2 rounded-full" />
    </div>
  );
};

export const LineStack = (props: DecoProps) => {
  const { className, length = 2 } = props;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <Line key={i} />
      ))}
    </div>
  );
};

export const Lines = () => {
  return (
    <Fragment>
      <Line />
      <Divider />
      <LineStack />
      <Divider className="mt-4" />
      <Line />
      <Divider />
      <LineStack length={5} />
      <Divider className="mt-4" />
      <Line />
    </Fragment>
  );
};

const NavbarSkeleton = () => (
  <nav className="navbar border-right fixed inset-0 flex h-screen w-[240px] flex-col bg-secondary px-4">
    <header className="flex-y gap-3 !py-3">
      🐈 <i className="skeleton h-2 w-full rounded-full" />
    </header>
    <LineStack />
    <Divider className="my-5" />
    <LineStack />
  </nav>
);

export const SpinnerWithLayout = (props: { text?: string }) => {
  const { text } = props;
  return (
    <div className="app-container overflow-hidden !p-0">
      <NavbarSkeleton />
      <main className="main-container">
        <div className="content flex-center h-screen">
          <div className="flex-center flex-col gap-4">
            <Spinner />
            {text}
          </div>
        </div>
      </main>
    </div>
  );
};

export const EntryHydrationSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-11 rounded-md" />
        ))}
      </div>
      <div className="skeleton h-11 w-full rounded-md" />
      <footer className="border-top flex-between [&>*]:skeleton py-5 [&>*]:rounded-md">
        <div className="h-5 w-[200px]" />
        <div className="h-8 w-[150px]" />
      </footer>
    </div>
  );
};

export const BigEntryHydrationSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[2fr_3fr] gap-9">
        <section className="flex-y gap-3">
          <div className="skeleton h-[100px] min-w-[100px] rounded-md" />
          <div className="flex w-full flex-col gap-2">
            <div className="skeleton h-8 w-full rounded-md" />
            <div className="flex-y gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-5 w-5 rounded-md" />
              ))}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn("skeleton h-8 rounded-md", {
                "h-[114px]": i === 2,
              })}
            />
          ))}
        </section>
      </div>
      <footer className="border-top [&>*]:skeleton py-5 [&>*]:rounded-md">
        <div className="ml-auto h-8 w-[150px]" />
      </footer>
    </div>
  );
};
