"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface RenderCollapsibleChaptersProps {
  chapter: CourseSidebarDataType["chapters"][0];
  index: number;
  slug: string;
}

const RenderCollapsibleChapters = ({ chapter, index, slug }: RenderCollapsibleChaptersProps) => {
  const pathname = usePathname();
  const lessonId = pathname.split("/").pop();
  const [open, setOpen] = useState(index === 0);

  return (
    <Collapsible key={chapter.id} open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant={"outline"} className="w-full p-3 h-auto flex items-center gap-2">
          <div>
            <ChevronRight className={`size-4 text-primary transition-transform ease-in-out duration-300 ${open ? "rotate-90" : ""}`} />
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-sm truncate text-foreground text-wrap line-clamp-2">
              {chapter.position}: {chapter.title}
            </p>
            <p className="text-xs text-muted-foreground font-medium truncate">{chapter.lessons.length} Lessons</p>
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 pl-3 border-l-2 space-y-3">
        {chapter.lessons.map((lesson: any) => (
          <LessonItem key={lesson.id} lesson={lesson} slug={slug} isActive={lesson.id === lessonId} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RenderCollapsibleChapters;
