import { TbRestore } from "react-icons/tb";

import { Link } from "~/components/ui/buttons/Link";
import { Wrapper } from "./Wrapper";
import { api } from "~/utils";
import { Button } from "~/components/ui/buttons/Button";

export const VocatioUrl = () => {
  const {
    data: user,
    isLoading: userLoading,
    isFetched,
  } = api.users.get.useQuery();
  const {
    data,
    mutate,
    isLoading: userUpdating,
    isSuccess,
    reset,
  } = api.users.update.useMutation();

  const { data: url, isLoading: shortUrlLoading } = api.urls.get.useQuery();
  const { mutate: createUrl } = api.urls.create.useMutation();

  return (
    <Wrapper entryFor="vocatioUrl">
      <header className="flex flex-col gap-3">
        <p>
          You can create a neat, short url for your linkedin profile instead of
          <br />
          <code>
            https://www.linkedin.com/in/
            {user?.contact?.linkedin}.
          </code>
        </p>
      </header>
      <div className="flex gap-5">
        {!!url?.shortUrl && (
          <div>
            Test it: <br />
            <Link
              text={`✨ vocat.io/${url?.shortUrl}.com`}
              to={`https://localhost:3000/${url?.shortUrl}.com`}
              className="hover:underline"
              newTab
            />
          </div>
        )}
        <Button
          text={shortUrlLoading ? "Searching your url..." : "Generate"}
          frontIcon={<TbRestore />}
          className="flex-y max-w-[300px] !bg-transparent hover:underline"
          disabled={shortUrlLoading}
        />
      </div>
      <p>
        When someone (likely a recruiter) visits this url, you will be notified.
        This behavior can be disabled.
      </p>
      <div className="grid grid-cols-2">
        <Button text="Disable" className="sm common rounded-md bg-red" />
        <Button
          text="Disable but keep short url"
          className="sm common rounded-md bg-blue"
        />
      </div>
      <footer className="border-top flex-between py-4">
        <span className="clr-disabled">
          In the future Vocatio release we&apos;ll shorten every URL for you
          automatically.
        </span>
      </footer>
    </Wrapper>
  );
};
