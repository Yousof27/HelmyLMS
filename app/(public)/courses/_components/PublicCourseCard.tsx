import { PublicCoursesType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/use-construct-url";
import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicCourseCardProps {
  course: PublicCoursesType;
}

const PublicCourseCard = ({ course }: PublicCourseCardProps) => {
  const thumbnailUrl = useConstructUrl(course.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image src={thumbnailUrl} alt={course.title} width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover" />
      <CardContent className="p-4">
        <Link
          href={`/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors w-fit"
        >
          {course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{course.smallDescription}</p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>
        </div>
        <Link href={`/courses/${course.slug}`} className={buttonVariants({ className: "w-full mt-4" })}>
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
};

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <Skeleton className="absolute top-2 right-2 z-10 h-6 w-12 rounded" />
      <Skeleton className="w-full rounded-t-xl aspect-video h-49.75 object-cover" />
      <CardContent className="p-4">
        <Skeleton className="w-2/3 h-6 rounded" />
        <Skeleton className="mt-2 h-4 rounded" />

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="w-12 h-4 rounded" />
          </div>
        </div>
        <Skeleton className="w-full mt-4 h-10 rounded" />
      </CardContent>
    </Card>
  );
}

export default PublicCourseCard;
