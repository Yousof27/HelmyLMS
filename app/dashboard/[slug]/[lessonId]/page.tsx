import { getLessonContent } from "@/app/data/course/get-lesson-content";
import LessonContent from "./_components/LessonContent";

interface LessonContentPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

const LessonContentPage = async ({ params }: LessonContentPageProps) => {
  const { lessonId } = await params;

  const lesson = await getLessonContent(lessonId);

  return <LessonContent lesson={lesson} />;
};

export default LessonContentPage;
