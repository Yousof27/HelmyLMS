import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollments-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import EmptyState from "@/components/general/EmptyState";
import AdminCourseCard from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";
import { AdminCoursesCardSkeletonLayout } from "./courses/page";

export default async function AdminPage() {
  const enrollments = await adminGetEnrollmentStats();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive enrollments={enrollments} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link href={`/admin/courses`} className={buttonVariants({ variant: "outline" })}>
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<AdminCoursesCardSkeletonLayout length={2} containerCSS="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7" />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const courses = await adminGetRecentCourses();

  if (courses.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="You don't have any courses. Create some to see them here."
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7">
      {courses.map((course: any) => (
        <AdminCourseCard data={course} key={course.id} />
      ))}
    </div>
  );
}
