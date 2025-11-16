"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourseAction(data: courseSchemaType): Promise<actionResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        statusText: "error",
        error: "Invalid Data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });

    return {
      statusText: "success",
      message: "Course Created Successfully",
    };
  } catch (error) {
    console.log("error");
    return {
      statusText: "error",
      error: `Create Course Error: ${error}`,
    };
  }
}
