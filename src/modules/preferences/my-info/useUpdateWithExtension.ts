import { ExtensionData, useSendMessage } from "~/hooks/useSendMessage";
import { BoxName } from "./types";
import { useEffect } from "react";
import { pick, startCase } from "lodash-es";
import { toast } from "sonner";
import { api } from "~/utils";
import { RouterUser } from "~/modules/types";

const { log } = console;

type UseUpdateWithExtensionProps = {
  updateKey: BoxName;
  expirationToken: string;
};

const updateKeyToDbKeys = (
  data: ExtensionData,
  updateKey: BoxName,
  user: RouterUser
) => {
  // @ts-ignore
  let slice = { [updateKey]: data.user[updateKey] };

  if (updateKey === "main") {
    slice = pick(data.user, ["name", "jobTitle", "linkedinId", "image"]);
    slice.contact = [
      {
        name: "Email",
        value: user.email,
      },
      ...data.user.contact,
    ];
  }

  return slice;
};

export const useUpdateWithExtension = (props: UseUpdateWithExtensionProps) => {
  const { updateKey, expirationToken } = props;

  const { sendMessage, hasSent, response, isExpired } = useSendMessage({
    expirationToken,
  });

  const { data: user } = api.users.get.useQuery();
  const {
    mutate: updateDatabase,
    isLoading: isUpdating,
    isSuccess: successUpdating,
  } = api.users.update.useMutation();

  useEffect(() => {
    if (!updateKey || isExpired || successUpdating) return;
    if (!hasSent) return sendMessage({ type: "get-user" });

    try {
      const shouldRetrieveData = response.success && !isUpdating && user;
      if (!shouldRetrieveData) return;

      const { data } = response;
      if (!data) throw new Error();

      const slice = updateKeyToDbKeys(data, updateKey, user);
      updateDatabase(slice);

      toast.success(`${startCase(updateKey)} updated.`);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  }, [response.success, hasSent, isExpired, user]);

  return { isSuccess: response.success, isExpired, successUpdating };
};
