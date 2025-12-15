import { getLessonContent } from "@/app/data/course/get-lesson-content";
import LessonContent, { LessonContentSkeleton } from "./_components/LessonContent";
import { Suspense } from "react";

interface LessonContentPageProps {
  params: Promise<{
    lessonId: string;
    slug: string;
  }>;
}

const LessonContentPage = ({ params }: LessonContentPageProps) => {
  return (
    <Suspense fallback={<LessonContentSkeleton />}>
      <LessonContentChild params={params} />
    </Suspense>
  );
};

const LessonContentChild = async ({ params }: LessonContentPageProps) => {
  const { lessonId, slug } = await params;

  const lesson = await getLessonContent(lessonId);

  return <LessonContent lesson={lesson} slug={slug} />;
};

export default LessonContentPage;
