"use server";
import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function completeLessonAction(lessonId: string, slug: string): Promise<actionResponse> {
  const user = await requireUser();
  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: user.id,
        lessonId,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      statusText: "success",
      message: "Lesson Completed",
    };
  } catch (error) {
    console.log("Lesson Completing Error:", error);
    return {
      statusText: "error",
      error: `Lesson Completing Error: ${error}`,
    };
  }
}
