"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";

export async function editCourseAction(data: courseSchemaType, courseId: string): Promise<actionResponse> {
  const user = requireAdmin();

  try {
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
