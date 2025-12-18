"use client";

import { PublicSingleCourseType } from "@/app/data/course/get-course";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconChevronLeft, IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";

const CollapsibleCourses = ({ course }: { course: PublicSingleCourseType }) => {
  return (
    <>
      {course.chapters.map((chapter: PublicSingleCourseType["chapters"][0], index) => {
        const [open, setOpen] = useState(index === 0);
        return (
          <Collapsible key={chapter.id} defaultOpen={index === 0} open={open} onOpenChange={setOpen}>
            <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
              <CollapsibleTrigger>
                <CardContent className="max-sm:py-3 max-sm:px-4 p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="flex text-xl lg:text-2xl max-sm:text-sm max-sm:size-8 size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </p>
                      <div>
                        <h3 className="text-md line-clamp-1 lg:text-lg font-semibold text-left">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 text-left sm:hidden">
                          {chapter.lessons.length} lesson
                          {chapter.lessons.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={"outline"} className="text-xs hidden sm:block">
                        {chapter.lessons.length} lesson
                        {chapter.lessons.length !== 1 ? "s" : ""}
                      </Badge>

                      <IconChevronLeft className={`size-5 text-muted-foreground transition-transform ${open ? "-rotate-90" : ""}`} />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t bg-muted/20">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center gap-4 rounded-lg max-sm:py-3 max-sm:px-4 p-6 hover:bg-accent transition-colors">
                      <div className="flex max-sm:size-8 size-10 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                        <IconPlayerPlay className="size-3 sm:size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium line-clamp-1 text-sm lg:text-[16px]">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Lesson {lessonIndex + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </>
  );
};

export default CollapsibleCourses;
