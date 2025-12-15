import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useSignOut() {
  const router = useRouter();

  const signOutHandler = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          router.push("/");
          toast.success("Logout Successfully");
        },
        onError: () => {
          toast.error("Logout Faild :(");
        },
      },
    });
  };

  return signOutHandler;
}
