import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Play } from "lucide-react";
import RenderCollapsibleChapters from "./RenderCollapsibleChapters";
import CourseProgress from "./CourseProgress";

interface CourseSidebarProps {
  course: CourseSidebarDataType;
}

const CourseSidebar = ({ course }: CourseSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 @3xl:pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">{course.title}</h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">{course.category}</p>
          </div>
        </div>

        <CourseProgress chapters={course.chapters} />
      </div>

      <div className="py-4 @3xl:pr-4 space-y-3">
        {course.chapters.map((chapter: any, index) => (
          <RenderCollapsibleChapters chapter={chapter} index={index} slug={course.slug} />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
