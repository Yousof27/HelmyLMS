"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

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
    console.log("Create Course Error:", error);
    return {
      statusText: "error",
      error: `Create Course Error: ${error}`,
    };
  }
}
