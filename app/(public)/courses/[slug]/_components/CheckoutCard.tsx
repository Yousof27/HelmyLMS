import { PublicSingleCourseType } from "@/app/data/course/get-course";
import { Card, CardContent } from "@/components/ui/card";
import { IconBook, IconCategory, IconChartBar, IconClock } from "@tabler/icons-react";
import { CheckIcon, Eye } from "lucide-react";
import Link from "next/link";
import EnrollmentButton from "./EnrollmentButton";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardRoute } from "@/app/data/routes/dashboard-route";

interface CheckoutCardProps {
  course: PublicSingleCourseType;
  userEnrolled: boolean;
  slug: string;
}

const CheckoutCard = async ({ course, userEnrolled, slug }: CheckoutCardProps) => {
  const { session } = await getDashboardRoute();

  return (
    <div className="sticky top-20">
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium">Price:</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("en-EG", {
                style: "currency",
                currency: "EGP",
              }).format(course.price)}
            </span>
          </div>

          <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
            <h4 className="font-medium">What you will get:</h4>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconClock className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">Course Duration</p>
                  <p className="text-sm text-muted-foreground">{course.duration} hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconChartBar className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">Course Level</p>
                  <p className="text-sm text-muted-foreground">{course.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconCategory className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconBook className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">Total Lessons</p>
                  <p className="text-sm text-muted-foreground">
                    {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} Lessons
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-4 ${session?.user.role !== "admin" && "mb-6"}`}>
            <h4>This course includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                  <CheckIcon className="size-4" />
                </div>
                <span>Full lifetime access.</span>
              </li>

              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                  <CheckIcon className="size-4" />
                </div>
                <span>Access on mobile and desktop.</span>
              </li>

              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                  <CheckIcon className="size-4" />
                </div>
                <span>Certificate of completion.</span>
              </li>
            </ul>
          </div>

          {session?.user.role !== "admin" && (
            <>
              {userEnrolled ? (
                <Link href={`/dashboard/${slug}`} className={buttonVariants({ className: "w-full" })}>
                  <Eye /> Watch Now
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}

              <p className="mt-3 text-center text-xs text-muted-foreground">30-day money-back guarantee</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutCard;
