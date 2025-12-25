"use client";

import { AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog } from "@radix-ui/react-alert-dialog";

import { ShieldCheck, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const DemoAdminCard = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function signInAsDemoAdmin() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/demo-admin-login", {
          method: "POST",
        });

        if (response.ok) {
          toast.success("Successfully logged in as Demo Admin!");
          router.push("/admin");
          router.refresh();
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to login");
        }
      } catch (error) {
        console.error("Demo login error:", error);
        toast.error("An error occurred while logging in");
      }
    });
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Demo Admin Access
        </CardTitle>
        <CardDescription>Experience the platform from an administrator's perspective</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <AlertDialog>
          <AlertDialogDescription className="text-xs">
            <div className="flex items-start gap-2 bg-muted/50 p-3">
              <Info className="size-4 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">This demo account is for recruiters and employers to explore the admin features.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialog>
        <Button onClick={signInAsDemoAdmin} disabled={isPending} className="w-full" size="lg">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              <span>Continue as Demo Admin</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoAdminCard;
