import { ReactNode } from "react";
import CourseSidebar from "./_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface EnrolledCourseLayoutProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

const EnrolledCourseLayout = async ({ params, children }: EnrolledCourseLayoutProps) => {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1 flex-col-reverse @3xl:flex-row">
      <div className="@3xl:w-80 @3xl:border-r border-border shrink-0 @max-3xl:pt-5 @max-3xl:border-t">
        <CourseSidebar course={course} />
      </div>

      <div className="flex-1 relative">{children}</div>
    </div>
  );
};

export default EnrolledCourseLayout;
