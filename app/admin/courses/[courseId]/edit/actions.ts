"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { chapterSchema, courseSchema, courseSchemaType, lessonSchema } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function editCourseAction(data: courseSchemaType, courseId: string): Promise<actionResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();

    const desicion = await aj.protect(req, { fingerprint: session.user.id });

    if (desicion.isDenied()) {
      return {
        statusText: "error",
        error: "Access Denied, Too many requests !",
      };
    }

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        statusText: "error",
        error: "Invalid Data",
      };
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { ...validation.data },
    });

    return {
      statusText: "success",
      message: "Course Updated Successfully",
    };
  } catch (error) {
    console.log("Edit Course Error:", error);
    return {
      statusText: "error",
      error: `Edit Course Error: ${error}`,
    };
  }
}

interface ReorderLessonsActionProps {
  courseId: string;
  chapterId: string;
  lessons: { id: string; position: number }[];
}

export async function reorderLessonsAction({ chapterId, courseId, lessons }: ReorderLessonsActionProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        statusText: "error",
        error: "No lessons to reordering",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId: chapterId },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      statusText: "success",
      message: `Lessons Reordered Successfully`,
    };
  } catch (error) {
    console.log("Reorder Lessons Error:", error);
    return {
      statusText: "error",
      error: `Reorder Lessons Error: ${error}`,
    };
  }
}

interface ReorderChaptersActionProps {
  courseId: string;
  chapters: { id: string; position: number }[];
}

export async function reorderChaptersAction({ courseId, chapters }: ReorderChaptersActionProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        statusText: "error",
        error: "No chapters to reordering",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id, courseId: courseId },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      statusText: "success",
      message: `Chapters Reordered Successfully`,
    };
  } catch (error) {
    console.log("Reorder Chapters Error:", error);
    return {
      statusText: "error",
      error: `Reorder Chapters Error: ${error}`,
    };
  }
}

interface CreateNewChapterProps {
  name: string;
  courseId: string;
}

export async function createNewChapterAction({ name, courseId }: CreateNewChapterProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    const validation = chapterSchema.safeParse({ name, courseId });

    if (!validation.success) {
      return {
        statusText: "error",
        error: "Invalid Data :(",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: { courseId: courseId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.chapter.create({
        data: { courseId: courseId, title: name, position: (maxPosition?.position ?? 0) + 1 },
      });
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      statusText: "success",
      message: `Chapter Created Successfully`,
    };
  } catch (error) {
    console.log("Create Chapter Error:", error);
    return {
      statusText: "error",
      error: `Create Chapter Error: ${error}`,
    };
  }
}

interface CreateNewLessonProps {
  name: string;
  courseId: string;
  chapterId: string;
}

export async function createNewLessonAction({ name, courseId, chapterId }: CreateNewLessonProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    const validation = lessonSchema.safeParse({ name, courseId, chapterId });

    if (!validation.success) {
      return {
        statusText: "error",
        error: "Invalid Data :(",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: { chapterId: chapterId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.lesson.create({
        data: {
          title: name,
          description: validation.data.description,
          videoKey: validation.data.videoKey,
          thumbnailKey: validation.data.thumbnailKey,
          chapterId: chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      statusText: "success",
      message: `Lesson Created Successfully`,
    };
  } catch (error) {
    console.log("Create Lesson Error:", error);
    return {
      statusText: "error",
      error: `Create Lesson Error: ${error}`,
    };
  }
}
