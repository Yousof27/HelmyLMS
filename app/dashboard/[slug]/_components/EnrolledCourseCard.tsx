"use client";

import { EnrolledCoursesType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EnrolledCourseCardProps {
  enrolledCourse: EnrolledCoursesType;
}

const EnrolledCourseCard = ({ enrolledCourse }: EnrolledCourseCardProps) => {
  const { course } = enrolledCourse;
  const thumbnailUrl = useConstructUrl(course.fileKey);
  const { lessonsNumber, lessonsCompletedNumber, completionPercent } = useCourseProgress(course.chapters as any);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image src={thumbnailUrl} alt={course.title} width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover" />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors w-fit"
        >
          {course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{course.smallDescription}</p>

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress</p>
            <p className="font-medium">{completionPercent}%</p>
          </div>
          <Progress value={completionPercent} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {lessonsCompletedNumber} of {lessonsNumber} lessons completed
          </p>
        </div>

        <Link href={`/dashboard/${course.slug}`} className={buttonVariants({ className: "w-full mt-4" })}>
          <Eye /> Watch Now
        </Link>
      </CardContent>
    </Card>
  );
};

export function EnrolledCourseCardSkeleton() {
  return (
    <>
      <Card className="group relative py-0 gap-0">
        <Skeleton className="absolute top-2 right-2 z-10 h-6 w-12 rounded" />
        <Skeleton className="w-full rounded-t-xl aspect-video h-49.75 object-cover" />
        <CardContent className="p-4">
          <Skeleton className="w-2/3 h-6 rounded" />
          <Skeleton className="w-2/3 h-6 rounded mt-3" />

          <div className="space-y-4 mt-5">
            <div className="flex justify-between mb-1 text-sm">
              <Skeleton className="w-12 h-6 rounded-md" />
              <Skeleton className="w-8 h-6 rounded-md" />
            </div>
            <Skeleton className="h-1.5 w-full rounded" />
            <Skeleton className="w-2/3 h-6 mt-1 rounded" />
          </div>

          <Skeleton className="w-full h-10 mt-3 rounded" />
        </CardContent>
      </Card>
    </>
  );
}

export default EnrolledCourseCard;
