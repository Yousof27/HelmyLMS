"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

export function useCourseProgress(chapters: CourseSidebarDataType["chapters"]) {
  return useMemo(() => {
    let lessonsNumber = 0;
    let lessonsCompletedNumber = 0;

    chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        lessonsNumber++;
        if (lesson.lessonProgress.length > 0) {
          lessonsCompletedNumber++;
        }
      });
    });

    const completionPercent = Number(((lessonsCompletedNumber * 100) / lessonsNumber).toFixed(1));

    return { lessonsNumber, lessonsCompletedNumber, completionPercent };
  }, [chapters]);
}
