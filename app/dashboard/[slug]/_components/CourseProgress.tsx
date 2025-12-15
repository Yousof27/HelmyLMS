"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface CourseProgressProps {
  chapters: CourseSidebarDataType["chapters"];
}

const CourseProgress = ({ chapters }: CourseProgressProps) => {
  const { lessonsNumber, lessonsCompletedNumber, completionPercent } = useCourseProgress(chapters);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {lessonsCompletedNumber}/{lessonsNumber} lessons
        </span>
      </div>
      <Progress value={completionPercent} className="h-1.5" />
      <p className="text-xs text-muted-foreground">{completionPercent}% Complteted</p>
    </div>
  );
};

export default CourseProgress;
