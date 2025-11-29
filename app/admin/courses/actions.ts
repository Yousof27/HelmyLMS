"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

interface deleteCourseActionProps {
  courseId: string;
}

export async function deleteCourseAction({ courseId }: deleteCourseActionProps): Promise<actionResponse> {
  await requireAdmin();
  try {
    await prisma.course.delete({ where: { id: courseId } });

    revalidatePath("/admin/courses");

    return {
      statusText: "success",
      message: "Course Deleted Successfully",
    };
  } catch (error) {
    console.log("Delete Course Error:", error);
    return {
      statusText: "error",
      error: `Delete Course Error: ${error}`,
    };
  }
}
