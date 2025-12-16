import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useConstructUrl from "@/hooks/use-construct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteCourseModal from "./DeleteCourseModal";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminCourseCardProps {
  data: AdminCoursesType;
}

const AdminCourseCard = ({ data }: AdminCourseCardProps) => {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="cursor-pointer">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`} className="cursor-pointer">
                <Pencil className="size-4 mr2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`} className="cursor-pointer">
                <Eye className="size-4 mr2" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteCourseModal courseId={data.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image src={thumbnailUrl} alt="Thumbnail" width={600} height={400} className="w-full rounded-t-lg aspect-video h-full object-cover" />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium text-lg line-clamp-1 hover:underline group-hover:text-primary transition-colors w-fit"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.smallDescription}</p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>
        <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({ className: "w-full mt-4" })}>
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-full">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[199px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="w-3/4 h-6 rounded" />
        <Skeleton className="mt-2 h-4 rounded" />

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>

          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>

        <Skeleton className="w-full mt-4 h-10 rounded" />
      </CardContent>
    </Card>
  );
}

export default AdminCourseCard;
