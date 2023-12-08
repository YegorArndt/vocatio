import cn from "classnames";
import { Divider } from "./layout/Divider";

export const Spinner = () => {
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
            width: 24px;
            height: 24px;
          }
          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 24px;
            height: 24px;
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

export const LineStack = (props: { className?: string }) => {
  const { className } = props;

  return (
    <div className={cn("flex w-1/2 flex-col gap-3", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-2 w-full rounded-md" />
      ))}
    </div>
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
