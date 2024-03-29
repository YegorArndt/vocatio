import { useRouter } from "next/router";
import { useEffect } from "react";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { toast } from "sonner";
import { Link } from "~/components/ui/buttons/Link";
import { useSendMessage } from "~/hooks/useSendMessage";
import { api } from "~/utils";
import { extensionUrl } from "../constants";
import { getSettings, updateSettings } from "../settings/settings";

const { log } = console;

const handleNotInstalled = () => {
  toast.dismiss();
  toast.error("Extension not installed.", {
    duration: Infinity,
    description: (
      <Link
        frontIcon={<LiaExternalLinkAltSolid size={15} />}
        text="Install from Google Web Store."
        to={extensionUrl}
        className="flex-y clr-blue"
        onClick={() => toast.dismiss()}
        newTab
      />
    ),
  });
};

export const useConnectExtension = () => {
  const { data: user, isError: errorGettingUser } = api.users.get.useQuery(
    undefined,
    { retry: false }
  );
  const { sendMessage, hasSent, response, isInstalled } = useSendMessage();
  const router = useRouter();

  const handleUserNotFound = () => {
    toast.dismiss();
    toast.info("Redirecting to login...");
    void router.push("/login");
  };

  const connectExtension = () => {
    if (user) {
      sendMessage({ type: "post-user", payload: { user } });
      toast.loading("Connecting the extension...", {
        duration: Infinity,
      });
    }
  };

  useEffect(() => {
    if (errorGettingUser) return handleUserNotFound();
    const settings = getSettings();
    const shouldRun = user && settings.hasConnectedExtension === false;

    if (!shouldRun) return;

    if (!hasSent) connectExtension();
    if (!isInstalled) handleNotInstalled();

    if (response.success) {
      updateSettings((prev) => ({ ...prev, hasConnectedExtension: true }));
      toast.dismiss();
      toast.success("Extension connected.");
    }
  }, [user, response.success, errorGettingUser, isInstalled]);

  useEffect(() => {
    const handler = () => {
      const settings = getSettings();
      if (settings.hasConnectedExtension === false) connectExtension();
    };

    window.onfocus = handler;

    return () => {
      window.onfocus = null;
    };
  }, []);
};
