import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
    },
  });

  if (!lesson) return notFound();

  return lesson;
}

export type AdminSingleLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
