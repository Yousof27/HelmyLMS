"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminSingleCourseType } from "@/app/data/admin/admin-get-course";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, FileText, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChaptersAction, reorderLessonsAction } from "../actions";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";

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
    course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        course.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen || true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];
      return updatedItems;
    });
  }, [course]);

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

      const updatedChaptersOrder = newLocalSortedChapters.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));

      const previousChapters = [...items];

      setItems(updatedChaptersOrder);

      const newChaptersActionData = updatedChaptersOrder.map((chapter) => ({ id: chapter.id, position: chapter.order }));

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

      const chapter = items.find((chapter) => chapter.id === chapterId);

      if (!chapter) return;

      const oldLessons = chapter.lessons;

      const newLessons = arrayMove(oldLessons, oldIndex, newIndex);

      const newLessonsUpdatedOrder = newLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newChapter = { ...chapter, lessons: newLessonsUpdatedOrder };

      const newChaptersState = items.map((chapter) => (chapter.id === chapterId ? newChapter : chapter));

      const previousChapters = [...items];

      setItems(newChaptersState);

      const newLessonsActionData = newLessons.map((lesson) => ({ id: lesson.id, position: lesson.order }));

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
    setItems(items.map((chapter) => (chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)));
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={course.id} />
        </CardHeader>

        <CardContent className="space-y-6">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((chapter) => (
              <SortableItem key={chapter.id} id={chapter.id} data={{ type: "chapter" }}>
                {(listeners) => (
                  <Card className="py-0">
                    <Collapsible open={chapter.isOpen} onOpenChange={() => toggleChapter(chapter.id)}>
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-0">
                          <Button variant="ghost" size="icon" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="group flex items-center hover:bg-transparent! hover:text-primary">
                              <ChevronRight className={`size-4 ${chapter.isOpen ? "rotate-90" : "rotate-0"} transition-transform`} />
                              <p>{chapter.title}</p>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <Button size="icon" variant="ghost" className="hover:text-destructive!">
                          <Trash2 />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext items={chapter.lessons} strategy={verticalListSortingStrategy}>
                            {chapter.lessons.map((lesson) => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{ type: "lesson", chapterId: chapter.id }}>
                                {(listeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link href={`/admin/courses/${course.id}/${chapter.id}/${lesson.id}`}>{lesson.title}</Link>
                                    </div>
                                    <Button size="icon" variant="ghost" className="hover:text-destructive!">
                                      <Trash2 />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal courseId={course.id} chapterId={chapter.id}  />
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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`touch-none ${isDragging ? "z-10" : ""}`}>
      {children(listeners)}
    </div>
  );
}

// Edit Course Error: PrismaClientKnownRequestError: Invalid `lessons.map((lesson)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lesson.update()` invocation in D:\Web\1- Front End\4- Next JS\lms-project\.next\dev\server\chunks\ssr\[root-of-the-server]__6588717a._.js:649:170 646 error: "No lessons to reordering" 647 }; 648 } → 649 const updates = lessons.map((lesson)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lesson.update(
