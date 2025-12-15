"use client";

import { AdminSingleLessonType } from "@/app/data/admin/admin-get-lesson";
import Uploader from "@/components/file-uploader/Uploader";
import CustomFormField from "@/components/react-hook-form/CustomFormField";
import FormInput from "@/components/react-hook-form/FormInput";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { tryCatch } from "@/hooks/use-tryCatch";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateLessonAction } from "../actions";

interface LessonFormProps {
  lesson: AdminSingleLessonType;
  courseId: string;
  chapterId: string;
}

const LessonForm = ({ lesson, courseId, chapterId }: LessonFormProps) => {
  const [pending, startTransition] = useTransition();

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson.title,
      description: lesson.description ?? "",
      thumbnailKey: lesson.thumbnailKey ?? "",
      videoKey: lesson.videoKey ?? "",
      chapterId: chapterId,
      courseId: courseId,
    },
  });

  function onSubmit(values: lessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateLessonAction({ lesson: values, lessonId: lesson.id }));
      if (error) {
        toast.error(`Faild to save the lesson. Please try again`);
        return;
      }
      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
      }
    });
  }

  return (
    <div>
      <Link className={buttonVariants({ variant: "outline", className: "mb-4" })} href={`/admin/courses/${courseId}/edit`}>
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>Configure the video and description for this lesson.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput form={form} name="name" placeholder="Enter lesson name" label="Lesson Name" />
              <CustomFormField form={form} name="description" label="Description" children={(field) => <RichTextEditor field={field} />} />
              <CustomFormField
                form={form}
                name="thumbnailKey"
                label="Thumbnail Image"
                children={(field) => <Uploader value={field.value} onChange={field.onChange} />}
              />
              <CustomFormField
                form={form}
                name="videoKey"
                label="Video File"
                children={(field) => <Uploader value={field.value} onChange={field.onChange} fileType="video" />}
              />
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="size-4" /> : "Save Lesson"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
