"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { generateUniqueCourseSlug } from "@/lib/slug";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function createCourseAction(data: courseSchemaType): Promise<actionResponse> {
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

    await prisma.$transaction(async (tx) => {
      const slug = await generateUniqueCourseSlug(validation.data.title);

      await tx.course.create({
        data: {
          ...validation.data,
          slug,
          userId: session.user.id as string,
        },
      });
    });

    return {
      statusText: "success",
      message: "Course Created Successfully",
    };
  } catch (error) {
    console.log("Create Course Error:", error);
    return {
      statusText: "error",
      error: `Create Course Error: ${error}`,
    };
  }
}
