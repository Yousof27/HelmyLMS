import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import getAllCourses from "../data/course/get-all-courses";
import EmptyState from "@/components/general/EmptyState";
import PublicCourseCard, { PublicCourseCardSkeleton } from "../(public)/courses/_components/PublicCourseCard";
import EnrolledCourseCard, { EnrolledCourseCardSkeleton } from "./[slug]/_components/EnrolledCourseCard";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

const GRID_CSS = "grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">Here you can see all the courses you have access to</p>
      </div>

      <Suspense fallback={<EnrolledCourseCardSkeletonLayout />}>
        <EnrolledCourseCardContent />
      </Suspense>

      <Separator />

      <section>
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">Here you can see all the courses you purchase</p>
        </div>

        <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
          <PublicCourseCardContent />
        </Suspense>
      </section>
    </>
  );
}

export async function EnrolledCourseCardContent() {
  const enrolledCourses = await getEnrolledCourses();

  if (enrolledCourses.length === 0) {
    return (
      <EmptyState title="No courses purchased" description="You have not purchased any courses yet" buttonText="Browse Courses" href="/courses" />
    );
  }

  return (
    <div className={GRID_CSS}>
      {enrolledCourses.map((course: any) => (
        <EnrolledCourseCard key={course.course.id} enrolledCourse={course} />
      ))}
    </div>
  );
}

export function EnrolledCourseCardSkeletonLayout() {
  return (
    <div className={GRID_CSS}>
      <EnrolledCourseCardSkeleton />
      <EnrolledCourseCardSkeleton />
    </div>
  );
}

export async function PublicCourseCardContent() {
  const [allCourses, enrolledCourses] = await Promise.all([getAllCourses(), getEnrolledCourses()]);
  return (
    <div className={GRID_CSS}>
      {allCourses
        .filter((course: any) => !enrolledCourses.some((enrolledCourse) => enrolledCourse.course.id === course.id))
        .map((course: any) => (
          <PublicCourseCard key={course.id} course={course} />
        ))}
    </div>
  );
}

export function PublicCourseCardSkeletonLayout() {
  return (
    <div className={GRID_CSS}>
      <PublicCourseCardSkeleton />
      <PublicCourseCardSkeleton />
    </div>
  );
}
