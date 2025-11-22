"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
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
    console.log("Edit Course Error:", error);
    return {
      statusText: "error",
      error: `Edit Course Error: ${error}`,
    };
  }
}
