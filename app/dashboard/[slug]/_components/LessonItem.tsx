"use client";

import { buttonVariants } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
    lessonProgress: {
      completed: boolean;
    }[];
  };
  slug: string;
  isActive: boolean;
}

const LessonItem = ({ isActive, lesson, slug }: LessonItemProps) => {
  const lessonCompleted = lesson.lessonProgress.length !== 0;
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: lessonCompleted ? "secondary" : "outline",
        className: `w-full p-2.5 h-auto justify-start transition-all
        ${
          lessonCompleted
            ? "bg-green-100 dark:bg-green-900/30 border border-transparent hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200"
            : isActive
            ? "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary"
            : ""
        }
        ${lessonCompleted && isActive && "border border-black! dark:border-green-700!"}
        `,
      })}
    >
      <div className="flex items-center gap-2.5 w-full">
        <div className="shrink-0">
          {lessonCompleted ? (
            <div className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
              <Check className="size-3 text-white" />
            </div>
          ) : (
            <div className={`size-5 rounded-full border bg-background flex justify-center items-center`}>
              <Play className={`size-2.5 fill-current`} />
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-between">
          <p
            className={`text-xs font-medium truncate ${
              lessonCompleted ? "text-green-800 dark:text-green-200" : isActive ? "text-primary font-semibold" : "text-foreground"
            }`}
          >
            {lesson.position}. {lesson.title}
          </p>
          {lessonCompleted && <p className="text-[11px] text-green-700 dark:text-green-300 font-normal">Completed</p>}

          {isActive && !lessonCompleted && <p className="text-[11px] text-primary font-medium">Watching</p>}
        </div>
      </div>{" "}
    </Link>
  );
};

export default LessonItem;
