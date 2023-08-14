export type Item = {
  period: string;
  companyName: string;
  jobTitle: string;
  description: string;
};

type TimelineProps = {
  items: Item[];
};

export const Timeline = (props: TimelineProps) => {
  const { items } = props;

  return (
    <ol className="border-gray-200 dark:border-gray-700 relative border-l clr-black">
      {items.map((item) => (
        <li key={item.description} className="mb-10 ml-4">
          <div className="dark:border-gray-900 dark:bg-gray-700 absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-white" />
          <time className="text-gray-400 dark:text-gray-500 mb-1 text-sm font-normal leading-none">
            {item.period}
          </time>
          <h3 className="text-gray-900 text-lg font-semibold dark:text-white">
            {item.companyName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-base font-normal">
            {item.jobTitle}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-base font-normal">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
};
