const Ball = () => <div className="h-10 w-10 rounded-full bg-skeleton"></div>;
const Title = () => <div className="h-[1.5rem] w-[50%] rounded bg-skeleton" />;
const Button = () => (
  <div className="ml-1 h-[32px] w-[300px] rounded-md bg-skeleton" />
);

export const VacancyCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto min-h-[320px] w-full max-w-sm rounded-md border p-4 shadow">
        <div className="flex animate-pulse flex-col gap-5">
          <header className="border-bottom flex flex-col gap-5 pb-5">
            <div className="flex items-center gap-3">
              {/* <Ball /> */}
              <Title />
            </div>
            <div className="h-[10px] w-[250px] rounded bg-skeleton" />
            <div className="flex flex-col gap-2">
              <div className="h-[10px] max-w-[150px] rounded bg-skeleton" />
              <div className="h-[10px] max-w-[150px] rounded bg-skeleton" />
            </div>
          </header>
          <section className="flex flex-col gap-5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[11px] w-[250px] rounded bg-skeleton" />
            ))}
          </section>
        </div>
      </div>
      <Button />
    </div>
  );
};
