"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { generateUniqueCourseSlug } from "@/lib/slug";
import { stripe } from "@/lib/stripe";
import { actionResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { CourseLevels, CourseStatus } from "@prisma/client";

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

    await prisma.$transaction(async (tx: any) => {
      const slug = await generateUniqueCourseSlug(validation.data.title);

      const stripeProduct = await stripe.products.create({
        name: validation.data.title,
        description: validation.data.smallDescription,
        default_price_data: {
          currency: "egp",
          unit_amount: validation.data.price * 100,
        },
      });

      await tx.course.create({
        data: {
          ...validation.data,
          level: validation.data.level as CourseLevels,
          status: validation.data.status as CourseStatus,
          slug,
          userId: session.user.id as string,
          stripePriceId: stripeProduct.default_price as string,
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
