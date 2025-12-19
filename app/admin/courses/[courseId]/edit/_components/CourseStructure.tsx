"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminSingleCourseType } from "@/app/data/admin/admin-get-course";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, FileText, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChaptersAction, reorderLessonsAction } from "../actions";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import DeleteLessonModal from "./DeleteLessonModal";
import DeleteChapterModal from "./DeleteChapterModal";

interface CourseStructureProps {
  course: AdminSingleCourseType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

const CourseStructure = ({ course }: CourseStructureProps) => {
  const initialItems =
    course.chapters.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      lessons: chapter.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updatedItems =
      course.chapters.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        lessons: chapter.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })),
      })) || [];

    setItems(updatedItems);
  }, [course]);

  useEffect(() => {
    setOpenChapters((prev) => {
      const newSet = new Set(prev);
      items.forEach((item: any) => newSet.add(item.id));
      return newSet;
    });
  }, []);

  function returnErrorToast(message: string) {
    toast.error(message);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";

    if (activeType === "chapter" && overType === "chapter") {
      const oldIndex = active.data.current?.sortable.index;
      const newIndex = over.data.current?.sortable.index;

      if (oldIndex === -1 || newIndex === -1) {
        returnErrorToast("Could not find indexes :(");
        return;
      }

      const newLocalSortedChapters = arrayMove(items, oldIndex, newIndex);

      const updatedChaptersOrder = newLocalSortedChapters.map((chapter: any, index: number) => ({
        ...chapter,
        order: index + 1,
      }));

      const previousChapters = [...items];

      setItems(updatedChaptersOrder);

      const newChaptersActionData = updatedChaptersOrder.map((chapter: any) => ({ id: chapter.id, position: chapter.order }));

      const reorderChaptersPrisma = () => reorderChaptersAction({ courseId: course.id, chapters: newChaptersActionData });

      toast.promise(reorderChaptersPrisma(), {
        success: (result) => {
          if (result.statusText === "success") return result.message;
          return result.error;
        },
        error: () => {
          setItems(previousChapters);
          return "Failed to reorder chapters :(";
        },
      });
    } else if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;

      if (!chapterId) return;

      const oldIndex = active.data.current?.sortable.index;
      const newIndex = over.data.current?.sortable.index;

      if (oldIndex === -1 || newIndex === -1) {
        returnErrorToast("Could not find indexes :(");
        return;
      }

      const chapter = items.find((chapter: any) => chapter.id === chapterId);

      if (!chapter) return;

      const oldLessons = chapter.lessons;

      const newLessons = arrayMove(oldLessons, oldIndex, newIndex);

      const newLessonsUpdatedOrder = newLessons.map((lesson: any, index: number) => ({
        ...lesson,
        order: index + 1,
      }));

      const newChapter = { ...chapter, lessons: newLessonsUpdatedOrder };

      const newChaptersState = items.map((chapter: any) => (chapter.id === chapterId ? newChapter : chapter));

      const previousChapters = [...items];

      setItems(newChaptersState);

      const newLessonsActionData = newLessons.map((lesson: any) => ({ id: lesson.id, position: lesson.order }));

      const reorderLessonsPromise = () => reorderLessonsAction({ chapterId, courseId: course.id, lessons: newLessonsActionData });

      toast.promise(reorderLessonsPromise(), {
        success: (result) => {
          if (result.statusText === "success") return result.message;
          return result.error;
        },
        error: () => {
          setItems(previousChapters);
          return "Failed to reorder lessons :(";
        },
      });
    }
  }

  function toggleChapter(chapterId: string) {
    setOpenChapters((prev) => {
      const newSet = new Set(prev);
      newSet.has(chapterId) ? newSet.delete(chapterId) : newSet.add(chapterId);
      return newSet;
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <Card className="@max-xl:py-3 @max-xl:gap-3">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border @max-xl:px-3 @max-xl:pb-3!">
          <CardTitle>Chapters: {items.length}</CardTitle>
          <NewChapterModal courseId={course.id} />
        </CardHeader>

        <CardContent className="space-y-3 @max-xl:px-3">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((chapter: any) => (
              <SortableItem key={chapter.id} id={chapter.id} data={{ type: "chapter" }}>
                {(listeners) => (
                  <Card className="py-0">
                    <Collapsible open={openChapters.has(chapter.id)} onOpenChange={() => toggleChapter(chapter.id)}>
                      <div className="flex items-center justify-between p-2 border-b border-border">
                        <div className="flex items-center gap-0">
                          <Button variant="ghost" size="icon" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="group flex items-center hover:bg-transparent! hover:text-primary pl-1.5! w-49 @sm:w-59 @md:w-[18rem] @lg:w-88.5 @2xl:w-md @3xl:w-133 @4xl:w-156 @5xl:w-196 @6xl:w-228"
                            >
                              <ChevronRight className={`size-4 ${openChapters.has(chapter.id) ? "rotate-90" : "rotate-0"} transition-transform`} />
                              <p className="w-full text-left truncate">{chapter.title}</p>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <DeleteChapterModal courseId={course.id} chapterId={chapter.id} />
                      </div>
                      <CollapsibleContent>
                        <div>
                          <SortableContext items={chapter.lessons} strategy={verticalListSortingStrategy}>
                            {chapter.lessons.map((lesson: any) => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{ type: "lesson", chapterId: chapter.id }}>
                                {(listeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${course.id}/${chapter.id}/${lesson.id}`}
                                        className="w-39 @sm:w-49 @md:w-62 @lg:w-78.5 @2xl:w-100 @3xl:w-123 @4xl:w-155 @5xl:w-186 @6xl:w-218 truncate"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLessonModal courseId={course.id} chapterId={chapter.id} lessonId={lesson.id} />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal courseId={course.id} chapterId={chapter.id} />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;

function SortableItem({ children, id, data }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id, data: data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`touch-none`}>
      {children(listeners)}
    </div>
  );
}
