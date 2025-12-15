import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const courses = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Successfull",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      completed: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return courses;
}

export type EnrolledCoursesType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];
