import { api } from "~/utils";
import { useUser } from "@clerk/nextjs";
import { BlurImage } from "~/components";
import { Link } from "~/components/ui/buttons/Link";
import { CiLinkedin } from "react-icons/ci";
import { Wrapper } from "./Wrapper";

export const ImageBox = () => {
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();

  const image = user?.image ?? defaultUserData?.user?.imageUrl;

  return (
    <Wrapper>
      <header className="flex-between">
        <h4 id="image">Image</h4>
        <Link
          frontIcon={<CiLinkedin size={30} />}
          text="Get LinkedIn image"
          to="https://www.linkedin.com/in/"
          className="flex-y gap-1 hover:underline"
          newTab
        />
      </header>
      <div className="flex justify-between pb-8">
        Your default CV image.
        <br /> Click on the image to upload another one from your files.
        <BlurImage
          src={image!}
          height={150}
          width={150}
          alt="user image"
          className="-ml-10  rounded-full"
        />
      </div>
    </Wrapper>
  );
};
