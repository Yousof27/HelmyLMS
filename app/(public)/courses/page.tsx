import getAllCourses from "@/app/data/course/get-all-courses";
import { Suspense } from "react";
import PublicCourseCard, { PublicCourseCardSkeleton } from "./_components/PublicCourseCard";

const PublicCoursesPage = () => {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-muted-foreground">Discover our wide range of courses designed to help you achieve your learning goals.</p>
      </div>

      <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};

export async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export function PublicCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default PublicCoursesPage;
