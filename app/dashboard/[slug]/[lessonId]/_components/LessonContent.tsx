"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-tryCatch";
import { completeLessonAction } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetii";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonContentProps {
  lesson: LessonContentType;
  slug: string;
}

const LessonContent = ({ slug, lesson }: LessonContentProps) => {
  const [pending, startTransaction] = useTransition();
  const { triggerConfetii } = useConfetti();

  const buttonHandler = () => {
    startTransaction(async () => {
      const { data: result, error } = await tryCatch(completeLessonAction(lesson.id, slug));

      if (error) {
        toast.error("An unexpected error accurred. Please try again.");
        return;
      }

      if (result.statusText === "error") {
        toast.error(result.error);
      } else if (result.statusText === "success") {
        toast.success(result.message);
        triggerConfetii();
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background @3xl:pl-6">
      <VideoPlayer thumbnailKey={lesson.thumbnailKey ?? ""} videoKey={lesson.videoKey ?? ""} />

      <div className="py-4 border-b flex flex-col items-start justify-between gap-4 @xl:flex-row @3xl:flex-col @3xl:items-start @4xl:flex-row">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
        {lesson.lessonProgress.length > 0 ? (
          <Button variant={"outline"} className="bg-green-500/10 text-green-500 hover:text-green-500" disabled={true}>
            <CheckCircle className="size-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button variant={"outline"} onClick={buttonHandler} disabled={pending}>
            <CheckCircle className="size-4 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 py-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Description:</h1>
        {lesson.description ? <RenderDescription json={JSON.parse(lesson.description)} /> : <p>This lesson does not have a description yet</p>}
      </div>
    </div>
  );
};

export function LessonContentSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background @3xl:pl-6">
      <Skeleton className="aspect-video rounded-lg" />

      <div className="py-4 border-b flex items-center justify-between">
        <Skeleton className="w-1/3 max-w-60 h-8 rounded" />

        <Skeleton className="w-1/3 max-w-60 h-8 rounded" />
      </div>

      <div className="space-y-3 py-4">
        <Skeleton className="w-32 h-8 rounded mb-5" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>
    </div>
  );
}

export default LessonContent;
