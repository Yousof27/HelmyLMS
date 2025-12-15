import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

export const requireNotAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role === "admin") {
    return notFound();
  }

  return session.user;
});
