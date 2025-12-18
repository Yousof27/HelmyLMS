"use client";

import { createCourseAction } from "@/app/admin/courses/create/actions";
import { tryCatch } from "@/hooks/use-tryCatch";
import { COURSE_LEVELS, COURSE_STATUSES, courseCategories, courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "../ui/form";
import FormInput from "./FormInput";
import { Button } from "../ui/button";
import { Loader2, Pencil, PlusIcon } from "lucide-react";
import FormTextArea from "./FormTextArea";
import CustomFormField from "./CustomFormField";
import Uploader from "../file-uploader/Uploader";
import FormSelect from "./FormSelect";
import RichTextEditor from "../rich-text-editor/Editor";
import { AdminSingleCourseType } from "@/app/data/admin/admin-get-course";
import { editCourseAction } from "@/app/admin/courses/[courseId]/edit/actions";
import { useConfetti } from "@/hooks/use-confetii";

interface CourseBasicInfoFormProps {
  data?: AdminSingleCourseType;
  usage?: "create" | "edit";
  courseId?: string;
}

const CourseBasicInfoForm = ({ data, usage = "create", courseId }: CourseBasicInfoFormProps) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetii } = useConfetti();

  const form = useForm<courseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      fileKey: data?.fileKey ?? "",
      price: data?.price ?? 0,
      duration: data?.duration ?? 0,
      level: data?.level ?? undefined,
      category: data?.category ?? "",
      status: data?.status ?? undefined,
      smallDescription: data?.smallDescription ?? "",
    },
  });

  function onSubmit(values: courseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(usage === "create" ? createCourseAction(values) : editCourseAction(values, courseId!));

      if (error) {
        toast.error(`Faild to ${usage} the course. Please try again`);
        return;
      }

      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
        if (usage === "create") {
          triggerConfetii();
        }
        form.reset();
        router.push("/admin/courses");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput form={form} name="title" label="Title" placeholder="Enter course title..." />

        <FormTextArea form={form} name="smallDescription" label="Small Description" placeholder="Small Description" textareaCSS="min-h-[120px]" />

        <CustomFormField form={form} name="description" label="Description" children={(field) => <RichTextEditor field={field} />} />

        <CustomFormField
          form={form}
          name="fileKey"
          label="Thumbnail Image"
          children={(field) => <Uploader onChange={field.onChange} value={field.value} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            form={form}
            name="category"
            label="Category"
            placeholder="Select Category"
            selectTriggerCSS="w-full"
            selectContent={courseCategories}
          />

          <FormSelect form={form} name="level" label="Level" placeholder="Select Level" selectTriggerCSS="w-full" selectContent={COURSE_LEVELS} />

          <FormInput form={form} name="duration" label="Duration (hours)" type="number" placeholder="0" />

          <FormInput form={form} name="price" label="Price (EGP)" type="number" placeholder="0" />
        </div>

        <FormSelect form={form} name="status" label="Status" placeholder="Select Status" selectTriggerCSS="w-full" selectContent={COURSE_STATUSES} />

        <Button type="submit" disabled={pending} className="gap-1">
          {pending ? (
            <>
              {usage === "create" ? "Creating" : "Editing"}... <Loader2 className="ml-1 animate-spin" />
            </>
          ) : (
            <>
              {usage === "create" ? (
                <>
                  <PlusIcon className="size-5" />
                  Create Course
                </>
              ) : (
                <>
                  <Pencil />
                  Edit Course
                </>
              )}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CourseBasicInfoForm;
