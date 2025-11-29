import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import LessonForm from "./_components/LessonForm";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { courseId, chapterId, lessonId } = await params;

  const lesson = await adminGetLesson(lessonId);

  return <LessonForm courseId={courseId} chapterId={chapterId} lesson={lesson} />;
};

export default LessonPage;
