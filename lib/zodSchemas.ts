import z from "zod";
import { COURSE_LEVELS, COURSE_STATUSES } from "./enums";

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Teaching & Academics",
];

export const courseSchema = z.object({
  title: z.string().min(3, { error: "Title must be at least 3 characters long" }).max(100, { error: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { error: "Description must be at least 3 characters long" })
    .max(2500, { error: "Description must be at most 2500 characters long" }),
  fileKey: z.string().min(1, { error: "File is required" }),
  price: z.number().min(1, { error: "Price must be positive number" }),
  duration: z.number().min(1, { error: "Duration must be at least 1 hour" }).max(500, { error: "Duration must be at most 500 hour" }),
  level: z.enum(COURSE_LEVELS, { error: "Level is required" }),
  category: z.enum(courseCategories, { error: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { error: "Small Description must be at least 3 characters long" })
    .max(200, { error: "Small Description must be at most 200 characters long" }),
  slug: z.string().min(3, { error: "Slug must be at least 3 characters" }),
  status: z.enum(COURSE_STATUSES, { error: "Status is required" }),
});

export type courseSchemaType = z.infer<typeof courseSchema>;

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { error: "File name is required" }),
  contentType: z.string().min(1, { error: "Content type is required" }),
  size: z.number().min(1, { error: "Size is required" }),
  isImage: z.boolean(),
});

export const chapterSchema = z.object({
  name: z.string().min(3, { error: "Chapter name must be at least 3 characters long" }),
  courseId: z.string(),
});

export type chapterSchemaType = z.infer<typeof chapterSchema>;
