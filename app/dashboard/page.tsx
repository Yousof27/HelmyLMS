import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import getAllCourses from "../data/course/get-all-courses";
import EmptyState from "@/components/general/EmptyState";
import PublicCourseCard from "../(public)/courses/_components/PublicCourseCard";
import Link from "next/link";

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([getAllCourses(), getEnrolledCourses()]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">Here you can see all the courses you have access to</p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState title="No courses purchased" description="You have not purchased any courses yet" buttonText="Browse Courses" href="/courses" />
      ) : (
        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7">
          {enrolledCourses.map((course) => (
            <Link href={`/dashboard/${course.course.slug}`}>{course.course.title}</Link>
          ))}
        </div>
      )}

      <section className="@container mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">Here you can see all the courses you purchase</p>
        </div>

        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4 gap-7">
          {allCourses
            .filter((course) => !enrolledCourses.some((enrolledCourse) => enrolledCourse.course.id === course.id))
            .map((course) => (
              <PublicCourseCard key={course.id} course={course} />
            ))}
        </div>
      </section>
    </>
  );
}
