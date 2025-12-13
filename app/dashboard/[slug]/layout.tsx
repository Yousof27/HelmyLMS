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
    <div className="flex flex-1">
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course} />
      </div>

      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default EnrolledCourseLayout;
