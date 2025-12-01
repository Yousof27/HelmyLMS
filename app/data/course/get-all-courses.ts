import { prisma } from "@/lib/db";

export default async function getAllCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
    },
  });

  return courses;
}

export type PublicCoursesType = Awaited<ReturnType<typeof getAllCourses>>[0];
