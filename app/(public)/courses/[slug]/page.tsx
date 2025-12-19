import getCourse from "@/app/data/course/get-course";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useConstructUrl from "@/hooks/use-construct-url";
import { IconCategory, IconChartBar, IconClock } from "@tabler/icons-react";
import Image from "next/image";
import { isUserEnrolled } from "@/app/data/user/is-user-enrolled";
import CollapsibleCourses from "./_components/CollapsibleCourses";
import CheckoutCard from "./_components/CheckoutCard";

interface CourseReviewPageProps {
  params: Promise<{ slug: string }>;
}

const CourseReviewPage = async ({ params }: CourseReviewPageProps) => {
  const { slug } = await params;
  const course = await getCourse(slug);
  const thumbnailUrl = useConstructUrl(course.fileKey);
  const userEnrolled = await isUserEnrolled(course.id);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image src={thumbnailUrl} alt={course.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">{course.smallDescription}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>

            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">Course Description</h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-2">
            <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">Course Content</h2>
            <div className="text-sm">
              {course.chapters.length} Chapters | {course.chapters.reduce((total: number, chapter: any) => total + chapter.lessons.length, 0) || 0} Lessons
            </div>
          </div>

          <div className="space-y-3">
            <CollapsibleCourses course={course} />
          </div>
        </div>
      </div>

      <div className="order-2 lg:col-span-1">
        <CheckoutCard course={course} slug={slug} userEnrolled={userEnrolled} />
      </div>
    </div>
  );
};

export default CourseReviewPage;
