"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";

interface updateLessonActionProps {
  lessonId: string;
  lesson: lessonSchemaType;
}

export async function updateLessonAction({ lessonId, lesson }: updateLessonActionProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    const validation = lessonSchema.safeParse(lesson);

    if (!validation.success) {
      return {
        statusText: "error",
        error: "Invalid Lesson Data :(",
      };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: lesson.name,
        description: lesson.description,
        thumbnailKey: lesson.thumbnailKey,
        videoKey: lesson.videoKey,
      },
    });

    return {
      statusText: "success",
      message: `Lesson Saved Successfully`,
    };
  } catch (error) {
    console.log("Updated Lesson Error:", error);
    return {
      statusText: "error",
      error: `Update Lesson Error: ${error}`,
    };
  }
}
