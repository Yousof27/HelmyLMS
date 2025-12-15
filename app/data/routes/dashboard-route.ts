import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getDashboardRoute = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const dashboardRoute =
    session?.user.role === "admin"
      ? { href: "/admin", name: "Dashboard" }
      : session
      ? { href: "/dashboard", name: "Dashboard" }
      : { href: "/login", name: "Login" };

  return { dashboardRoute, session };
});
