import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, { AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import { Suspense } from "react";

const CoursesPage = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
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
        <EmptyState title="No courses found" description="Create a new course" buttonText="Create Course" href="/admin/courses/create" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

export function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default CoursesPage;
