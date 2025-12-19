import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, { AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import { Suspense } from "react";

const AdminCoursesPage = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <Suspense
        fallback={
          <AdminCoursesCardSkeletonLayout length={4} containerCSS="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7" />
        }
      >
        <RenderCourses />
      </Suspense>
    </>
  );
};

export async function RenderCourses() {
  const courses = await adminGetCourses();
  return (
    <>
      {courses.length === 0 ? (
        <EmptyState title="No courses yet" description="Create a new course" buttonText="Create Course" href="/admin/courses/create" />
      ) : (
        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7">
          {courses.map((course: any) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

export function AdminCoursesCardSkeletonLayout({ length, containerCSS }: { length: number; containerCSS: string }) {
  return (
    <div className={containerCSS}>
      {Array.from({ length: length }).map((_, index: number) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default AdminCoursesPage;
