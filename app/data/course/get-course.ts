import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return notFound();

  return course;
}

export type PublicSingleCourseType = Awaited<ReturnType<typeof getCourse>>;
