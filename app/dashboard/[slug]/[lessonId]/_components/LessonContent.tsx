import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

interface LessonContentProps {
  lesson: LessonContentType;
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer thumbnailKey={lesson.thumbnailKey ?? ""} videoKey={lesson.videoKey ?? ""} />

      <div className="py-4 border-b">
        <Button variant={"outline"}>
          <CheckCircle className="size-4 text-green-500" />
          Mark as Complete
        </Button>
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{lesson.title}</h1>

        {lesson.description && <RenderDescription json={JSON.parse(lesson.description)} />}
      </div>
    </div>
  );
};

export default LessonContent;
