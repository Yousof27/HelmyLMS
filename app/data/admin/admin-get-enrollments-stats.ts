import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let last30Days: { date: string; enrollments: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    last30Days.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }

  const dateMap = new Map(last30Days.map((day, i) => [day.date, i]));

  enrollments.forEach((enrollment) => {
    const date = enrollment.createdAt.toISOString().split("T")[0];
    const index = dateMap.get(date);

    if (index !== undefined) {
      last30Days[index].enrollments++;
    }
  });

  return last30Days;
}
