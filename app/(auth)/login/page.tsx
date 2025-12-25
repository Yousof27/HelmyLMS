import { auth } from "@/lib/auth";
import LoginForm from "./_components/LoginForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DemoAdminCard from "./_components/DemoAdminCard";

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <LoginForm />

      <div className="relative text-center text-sm">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">For recruiters & employers</span>
      </div>

      <DemoAdminCard />
    </div>
  );
};

export default LoginPage;
